import Vinyl from "vinyl";
import { Transform, TransformCallback, Readable } from "stream";
import { Logger, dummyLogger } from "ts-log";
import { Config } from "./config";
import extend from "just-extend";
import { resolve as resolvePath } from "path";
import PluginError from "plugin-error";
import { BundleStreamFactory, Bundle } from "./bundle";

const PluginName = "@userfrosting/gulp-bundle-assets";

export interface Results {
    scripts: Map<string, Vinyl[]>;
    styles: Map<string, Vinyl[]>;
}

export interface ResultsCallback {
    (results: Results): void
}

/**
 * Interface defining factories required to bundle styles and scripts.
 */
export interface Bundlers {
    /**
     * Returns a Transform that will handle bundling of script resources.
     */
    Scripts: BundleStreamFactory

    /**
     * Returns a Transform that will handle bundling of style resources.
     */
    Styles: BundleStreamFactory;
}

function bundleFactory(
    name: string,
    rawPaths: string[],
    cwd: string,
    joiner: BundleStreamFactory,
    logger: Logger
) {
    const paths = [];
    for (const rawPath of rawPaths) {
        logger.trace(`Original path: ${rawPath}`);
        const path = resolvePath(cwd, rawPath);
        paths.push(path);
        logger.trace(`Resolved path: "${path}"`);
    }
    return new Bundle(name, paths, joiner, logger);
}

async function handleVinylChunk(
    chunk: Vinyl,
    bundles: Set<Bundle>,
    tracker: Map<string, Vinyl[]>,
    push: (chunk: any) => void,
    logger: Logger
) {
    for (const bundle of bundles) {
        const results = await bundle.feed(chunk);
        if (results) {
            bundles.delete(bundle);
            tracker.set(bundle.name, results);
            for (const result of results) {
                push(result);
            }
        }
    }
}

/**
 * Orchastrates bundling.
 */
export class BundleOrchastrator extends Transform {

    private scriptBundles: Set<Bundle> = new Set();

    private styleBundles: Set<Bundle> = new Set();

    private results: Results = {
        scripts: new Map(),
        styles: new Map(),
    };

    private resultsCallback?: ResultsCallback;

    private logger: Logger = dummyLogger;

    /**
     * @param config Raw (but valid) configuration file used for bundle resolution.
     * @param joiner Object capable of generating the Transform streams needed for generation of final bundles.
     * @param resultsCallback
     */
    constructor(config: Config, joiner: Bundlers, resultsCallback?: ResultsCallback) {
        super({
            objectMode: true,
        });

        // First up, we assign the logger if its there
        if (config.Logger) this.logger = config.Logger;

        // Results callback
        this.resultsCallback = resultsCallback;

        // Deep clone config object to prevent mutations from spilling out
        config = extend(true, {}, config);

        // TODO Will we need to have a cwd to be able to match paths? Probably.

        // Add bundles
        if (config.bundle) {
            for (const name in config.bundle) {
                /* istanbul ignore else */
                if (!config.bundle.hasOwnProperty(name)) {
                    continue;
                }

                const bundle = config.bundle[name];

                // JS
                if (bundle.scripts) {
                    this.logger.trace("Starting processing of script paths");
                    this.scriptBundles.add(bundleFactory(name, bundle.scripts, process.cwd(), joiner.Scripts, this.logger));
                    this.logger.trace("Completed processing of script paths");
                }

                // CSS
                if (bundle.styles) {
                    this.logger.trace("Starting processing of style paths");
                    this.styleBundles.add(bundleFactory(name, bundle.styles, process.cwd(), joiner.Styles, this.logger));
                    this.logger.trace("Completed processing of style paths");
                }
            }
        }
    }

    /**
     * Collects copies of applicable files to later bundle.
     *
     * @param chunk Stream chunk, may be a Vinyl object.
     * @param encoding Encoding of chunk, if applicable.
     * @param callback Callback to indicate processing is completed.
     */
    public async _transform(chunk: any, encoding: string, callback: TransformCallback): Promise<void> {
        try {
            // Only handle Vinyl chunks
            if (!Vinyl.isVinyl(chunk)) {
                this.logger.warn("Ignoring recieved non-Vinyl chunk");
                this.push(chunk, encoding);
                return;
            }

            this.logger.trace("Recieved Vinyl chunk", { pathHistory: chunk.history });

            // Offer chunks to bundles, return any results
            await handleVinylChunk(chunk, this.scriptBundles, this.results.scripts, this.push, this.logger);
            await handleVinylChunk(chunk, this.styleBundles, this.results.styles, this.push, this.logger);

            // Push chunk on through
            this.push(chunk);

            callback();
        }
        catch (error) {
            this.logger.error("_transform completed with error", { error });
            callback(new PluginError(PluginName, error));
        }
    }

    public async _flush(callback: TransformCallback): Promise<void> {
        try {
            // Produce error if there are bundles without all requirements
            if (this.scriptBundles.size > 0 || this.styleBundles.size > 0) {
                throw new Error("Stream completed before all bundles recieved their dependencies");
            }

            // Invoke results callback
            if (this.resultsCallback) this.resultsCallback(this.results);

            callback();
        }
        catch (error) {
            this.logger.error("_flush completed with error", { error });
            callback(new PluginError(PluginName, error));
        }
    }
}
