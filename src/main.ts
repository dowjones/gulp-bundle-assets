import Extend from "just-extend";
import { resolve as resolvePath } from "path";
import PluginError from "plugin-error";
import { Readable, Transform, TransformCallback, Stream } from "stream";
import Vinyl from "vinyl";
import { BundlesProcessor } from "./bundles-processor";
import { LogLevel } from "./log-levels";
import { PluginName } from "./plugin-details";
import { Config } from "./config/config";

// Foward public exports
export { default as MergeRawConfigs } from "./config/merge-configs";
export { default as ValidateRawConfig } from "./config/validate-config";

/**
 * Assists in orchastrating bundle operations.
 */
export default class Bundler extends Transform {

    /**
     * Tracks all files resolved within virtual directory tree.
     * Number is used to track preference during inital file collection.
     */
    private ResolvedFiles: Map<string, [Vinyl, number]> = new Map();

    /**
     * Used in conversion of canonical paths to virtual paths (for scenarios with resource overriding, etc).
     * First string is an absolute path, second is a matching virtual path.
     */
    private VirtualPathRules: [string, string][] = [];

    /**
     * Script bundles to build.
     */
    private ScriptBundles: Map<string, string[]> = new Map();

    /**
     * Style bundles to build.
     */
    private StyleBundles: Map<string, string[]> = new Map();

    /**
     * Bundlers to use when generating bundles.
     */
    private Bundlers: Bundlers;

    /**
     * Map containing output filenames for each bundle.
     * Key is bundle name, value is the file path.
     */
    private BundleResultsMap: Map<string, Vinyl[]> = new Map();

    /**
     * Callback to execute once bundle results map is complete.
     */
    private BundleResultsCallback?: (results: Map<string, Vinyl[]>) => void;

    /**
     * Logger function.
     */
    private Logger = (value: string, level: LogLevel) => {};

    /**
     * @param config Raw (but valid) configuration file used for bundle resolution.
     * @param joiner Object capable of generating the Transform streams needed for generation of final bundles.
     */
    constructor(config: Config, joiner: Bundlers, bundleResultsCallback?: (results: Map<string, Vinyl[]>) => void) {
        super({
            objectMode: true
        });

        // First up, we assign the logger if its there
        if (config.Logger) this.Logger = config.Logger;

        // Deep clone config object to prevent mutations from spilling out
        config = Extend(true, {}, config);

        // Extract virtual path (if set) and make canonical paths absolute
        if (config.VirtualPathRules) {
            for (const [oldPath, newPath] of config.VirtualPathRules) {
                this.VirtualPathRules.push([
                    resolvePath(oldPath),
                    resolvePath(newPath)]);
            }
        }

        // Set bundle base path to current working directory if not set
        if (!config.BundlesVirtualBasePath) {
            config.BundlesVirtualBasePath = process.cwd();
        }

        this.Logger(`Bundle resources will be resolved with: "${config.BundlesVirtualBasePath}"`, LogLevel.Silly);

        // Add bundles
        if (config.bundle) {
            for (const name in config.bundle) {
                if (config.bundle.hasOwnProperty(name)) {
                    const bundle = config.bundle[name];

                    // JS
                    if (bundle.scripts) {
                        this.Logger("Starting processing of script paths", LogLevel.Silly);
                        let paths = [];
                        for (const path of bundle.scripts) {
                            this.Logger(`Original path: ${path}`, LogLevel.Silly);
                            const resolvedPath = resolvePath(config.BundlesVirtualBasePath + "/" + path);
                            this.Logger(`Resolved path: "${resolvedPath}"`, LogLevel.Silly);
                            paths.push(resolvedPath);
                        }
                        this.ScriptBundles.set(name, paths);
                        this.Logger("Completed processing of script paths", LogLevel.Silly);
                    }

                    // CSS
                    if (bundle.styles) {
                        this.Logger("Starting processing of style paths", LogLevel.Silly);
                        let paths = [];
                        for (const path of bundle.styles) {
                            this.Logger(`Original path: ${path}`, LogLevel.Silly);
                            const resolvedPath = resolvePath(config.BundlesVirtualBasePath + "/" + path);
                            this.Logger(`Resolved path: ${resolvedPath}`, LogLevel.Silly);
                            paths.push(resolvedPath);
                        }
                        this.StyleBundles.set(name, paths);
                        this.Logger("Completed processing of style paths", LogLevel.Silly);
                    }
                }
            }
        }

        this.Bundlers = joiner;

        this.BundleResultsCallback = bundleResultsCallback;
    }

    /**
     * Attempts to create a virutal path from the provided path.
     * On failure, the provided path is returned.
     *
     * @param path Absolute path to try and resolve.
     *
     * @returns New or existing path and preference.
     */
    private ResolveVirtualPath(path: string): [string, number] {
        this.Logger(`Resolving virtual path for "${path}"`, LogLevel.Silly);
        // Try to resolve a virtual path
        for (const [index, [oldPathStart, newPathStart]] of this.VirtualPathRules.entries()) {
            if (path.startsWith(oldPathStart)) {
                const resolvedPath = resolvePath(path.replace(oldPathStart, newPathStart));
                this.Logger(`Resolved path is "${resolvedPath}" and preference "${index}"`, LogLevel.Silly);
                return [resolvedPath, index];
            }
        }

        // No matches, lowest preference
        this.Logger("No virtual path can be resolved, returning given path with lowest preference level", LogLevel.Silly);
        return [path, 0];
    }

    /**
     * Collects copies of applicable files to later bundle.
     *
     * @param chunk Stream chunk, may be a Vinyl object.
     * @param encoding Encoding of chunk, if applicable.
     * @param callback Callback to indicate processing is completed.
     */
    public _transform(chunk: any, encoding: string, callback: TransformCallback): void {
        try {
            if (Vinyl.isVinyl(chunk)) {
                this.Logger(`Recieved Vinyl chunk with path "${chunk.path}"`, LogLevel.Silly);

                // Grab virtual path
                const [virtualPath, preference] = this.ResolveVirtualPath(chunk.path);

                // Add to resolved files (handling collisions according to preference)
                const existingFile = this.ResolvedFiles.get(virtualPath);
                if (existingFile) {
                    if (existingFile[1] < preference) {
                        this.Logger(`File "${chunk.path}" with preference ${preference} is overriding file "${existingFile[0].path}" with preference ${existingFile[1]} identified by "${virtualPath}"`, LogLevel.Silly);
                        this.ResolvedFiles.set(virtualPath, [chunk, preference]);
                    }
                    else this.Logger(`File "${chunk.path}" with preference ${preference} is being discarded in favour of a file with a higher preference identified by "${virtualPath}"`, LogLevel.Silly);
                }
                else {
                    this.ResolvedFiles.set(virtualPath, [chunk, preference]);
                    this.Logger(`File "${chunk.path}" with preference ${preference} is now being tracked and is identified by "${virtualPath}"`, LogLevel.Silly);
                }
            }
            else {
                // Push incompatible chunk on through
                this.push(chunk);
                this.Logger("Pushed incompatible chunk onward, stream should only contain Vinyl instances", LogLevel.Complain);
            }

            // Indicate transform is complete
            callback();
        }
        catch (error) {
            /* istanbul ignore next: Applying coverage here is out of scope as errors produced cannot yet be predicted. */
            this.Logger("_transform completed with error", LogLevel.Scream);
            /* istanbul ignore next */
            callback(new PluginError(PluginName, error));
        }
    }

    /**
     * Does bundling and pushes resulting files into stream.
     * @param callback Callback to indicate processing is completed.
     */
    public async _flush(callback: TransformCallback): Promise<void> {
        try {
            // Scripts
            this.Logger("Starting bundling of scripts", LogLevel.Normal);
            let [chunks, resultsMap] = await BundlesProcessor(this.ResolvedFiles, this.ScriptBundles, this.Bundlers.Scripts, this.Logger);

            for (const chunk of chunks) {
                this.push(chunk);
            }

            for (const [name, paths] of resultsMap)
                this.BundleResultsMap.set(name, paths);

            this.Logger("Completed bundling of scripts", LogLevel.Normal);

            // Styles
            this.Logger("Starting bundling of styles", LogLevel.Normal);
            [chunks, resultsMap] = await BundlesProcessor(this.ResolvedFiles, this.StyleBundles, this.Bundlers.Styles, this.Logger);


            for (const chunk of chunks) {
                this.push(chunk);
            }

            for (const [name, paths] of resultsMap) {
                if (this.BundleResultsMap.has(name)) {
                    const allPaths = this.BundleResultsMap.get(name);
                    allPaths.push(...paths)
                    this.BundleResultsMap.set(name, allPaths);
                }
                else this.BundleResultsMap.set(name, paths);
            }

            this.Logger("Completed bundling of styles", LogLevel.Normal);

            this.Logger("All bundles have been built", LogLevel.Normal);

            // Push resolved files on through
            for (const [virtualPath, [chunk]] of this.ResolvedFiles) {
                this.Logger(`Pushing resolved file onward
Virtual path: "${virtualPath}"
Actual path: "${chunk.path}`, LogLevel.Silly);
                this.push(chunk);
            }
            this.Logger("All resolved files pushed, clearing resolved files map", LogLevel.Silly);
            this.ResolvedFiles.clear();

            if (this.BundleResultsCallback) {
                this.Logger("Invoking bundle results callback", LogLevel.Normal);
                this.BundleResultsCallback(this.BundleResultsMap);
            }

            callback();
        }
        catch (error) {
            // Ideally this shouldn't ever be needed, however we *are* dealing with external data.
            this.Logger("_flush completed with error", LogLevel.Scream);
            callback(new PluginError(PluginName, error));
        }
    }
}

/**
 * Interface defining factories required to bundle styles and scripts.
 */
export interface Bundlers {
    /**
     * Returns a Transform that will handle bundling of script resources.
     */
    Scripts: BundlerStreamFactory

    /**
     * Returns a Transform that will handle bundling of style resources.
     */
    Styles: BundlerStreamFactory;
}

/**
 * A function that returns a stream that will be used to bundle assets.
 */
export interface BundlerStreamFactory {
    /**
     * @param name Name of bundle.
     */
    (src: Readable, name: string): Stream;
}
