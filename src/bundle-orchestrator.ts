import Vinyl from "vinyl";
import { Transform, TransformCallback } from "stream";
import { Logger, dummyLogger } from "ts-log";
import { Config } from "./config/config.js";
import extend from "just-extend";
import { resolve as resolvePath } from "path";
import PluginError from "plugin-error";
import { BundleStreamFactory, Bundle, BundleType } from "./bundle.js";

const PluginName = "@userfrosting/gulp-bundle-assets";

/**
 * Bundler results data shape.
 * @public
 */
export interface Results {
    scripts: Map<string, Vinyl[]>;
    styles: Map<string, Vinyl[]>;
}

/**
 * Bundler results callback function interface.
 * @public
 */
export interface ResultsCallback {
    /**
     * @param results - Results data.
     */
    (results: Results): void
}

/**
 * Interface defining factories required to bundle styles and scripts.
 * @public
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

/**
 * Helper responsible for constructing bundle instances.
 * @param name - Name of bundle.
 * @param rawPaths - Array of paths to assets which have not yet been fully resolved.
 * @param cwd - The current working directory to use for resolving raw paths.
 * @param joiner - User provided 'glue' functions.
 * @param logger - Logging interface.
 */
function bundleFactory(
    name: string,
    type: BundleType,
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
    return new Bundle(name, type, paths, joiner, logger);
}

/**
 * Helper responsible for 'offering' chunks (Vinyl instances) to bundles.
 * Removes bundles from set if they have all their needed chunks.
 * @param chunk - A Vinyl instance.
 * @param bundles - Set of bundles that will be offered chunk.
 * @param tracker - Tracks bundles and their chunks.
 * @param push - Callback used to push out completed bundles.
 */
async function handleVinylChunk(
    chunk: Vinyl,
    bundles: Set<Bundle>,
    tracker: Map<string, Vinyl[]>,
    push: (chunk: any) => void
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
 * Orchestrates bundling.
 * @public
 */
export class BundleOrchestrator extends Transform {

    private scriptBundles: Set<Bundle> = new Set();

    private styleBundles: Set<Bundle> = new Set();

    private results: Results = {
        scripts: new Map(),
        styles: new Map(),
    };

    private resultsCallback?: ResultsCallback;

    private logger: Logger = dummyLogger;

    /**
     * @param config - Raw (but valid) configuration file used for bundle resolution.
     * @param joiner - Object capable of generating the Transform streams needed for generation of final bundles.
     * @param resultsCallback - Callback invoked once all bundles generated.
     */
    constructor(config: Config, joiner: Bundlers, resultsCallback?: ResultsCallback) {
        super({
            objectMode: true,
        });

        // First up, we assign the logger if its there
        /* istanbul ignore else */
        if (config.Logger) this.logger = config.Logger;

        // Results callback
        this.resultsCallback = resultsCallback;

        // Deep clone config object to prevent mutations from spilling out
        config = extend(true, {}, config);

        // Current working directory
        const cwd = config.cwd ?? process.cwd();

        // Add bundles
        if (config.bundle) {
            for (const name of Object.getOwnPropertyNames(config.bundle)) {
                const bundle = config.bundle[name];

                // JS
                if (bundle.scripts) {
                    this.logger.trace("Starting processing of script paths");
                    this.scriptBundles.add(bundleFactory(name, "script", bundle.scripts, cwd, joiner.Scripts, this.logger));
                    this.logger.trace("Completed processing of script paths");
                }

                // CSS
                if (bundle.styles) {
                    this.logger.trace("Starting processing of style paths");
                    this.styleBundles.add(bundleFactory(name, "style", bundle.styles, cwd, joiner.Styles, this.logger));
                    this.logger.trace("Completed processing of style paths");
                }
            }
        }
    }

    /**
     * Collects copies of applicable files to later bundle.
     *
     * @param chunk - Stream chunk, may be a Vinyl object.
     * @param encoding - Encoding of chunk, if applicable.
     * @param callback - Callback to indicate processing is completed.
     */
    public async _transform(chunk: any, encoding: BufferEncoding, callback: TransformCallback): Promise<void> {
        try {
            // Only handle Vinyl chunks
            if (!Vinyl.isVinyl(chunk)) {
                this.logger.warn("Ignoring received non-Vinyl chunk");
                this.push(chunk, encoding);
                callback();
                return;
            }

            this.logger.trace("Received Vinyl chunk", { pathHistory: chunk.history });

            // Offer chunks to bundles, return any results
            await handleVinylChunk(chunk, this.scriptBundles, this.results.scripts, this.push.bind(this));
            await handleVinylChunk(chunk, this.styleBundles, this.results.styles, this.push.bind(this));

            // Push chunk on through
            this.push(chunk);

            callback();
        }
        catch (error) {
            /* istanbul ignore next This is only here to ensure we are a polite pipeline member, and cannot be reasonably tested */
            this.logger.error("_transform completed with error", { error });
            /* istanbul ignore next */
            callback(new PluginError(PluginName, error));
        }
    }

    public async _flush(callback: TransformCallback): Promise<void> {
        try {
            // Produce error if there are bundles without all requirements
            if (this.scriptBundles.size > 0 || this.styleBundles.size > 0) {
                const missingBundles: {
                    type: BundleType,
                    name: string,
                    remainingFiles: string[],
                }[] = [];
                for (const bundle of this.scriptBundles) {
                    missingBundles.push(bundle.report());
                }
                for (const bundle of this.styleBundles) {
                    missingBundles.push(bundle.report());
                }
                const errMessage = "Stream completed before all bundles received their dependencies";
                this.logger.error(errMessage, missingBundles);
                throw new Error(errMessage);
            }

            // Invoke results callback
            if (this.resultsCallback) this.resultsCallback(this.results);

            callback();
        }
        catch (error) {
            this.logger.error("_flush completed with error", { error: error.toString() });
            callback(new PluginError(PluginName, error));
        }
    }
}
