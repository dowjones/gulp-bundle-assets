import { resolve as resolvePath } from "path";
import PluginError from "plugin-error";
import { Transform, TransformCallback, Readable } from "stream";
import Vinyl from "vinyl";
import { BundlesProcessor } from "./bundles-processor";
import { PluginName } from "./plugin-details";
import { RawConfig } from "./raw-config";

// Foward public exports
export { MergeRawConfigs, ValidateRawConfig } from "./raw-config";

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
    private PathTransforms: [string, string][] = [];

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
     * @param config Raw (but valid) configuration file used for bundle resolution.
     * @param joiner Object capable of generating the Transform streams needed for generation of final bundles.
     */
    constructor(config: RawConfig, joiner: Bundlers, bundleResultsCallback?: (results: Map<string, Vinyl[]>) => void) {
        super({
            objectMode: true
        });

        // Extract path transformations (if set) and make canonical paths absolute
        if (config.VirtualPathRules) {
            for (const [oldPath, newPath] of config.VirtualPathRules)
                this.PathTransforms.push([
                    resolvePath(oldPath),
                    resolvePath(newPath)]);
        }

        // Set bundle base path to current working directory if not set
        if (!config.BundlesVirtualBasePath) {
            config.BundlesVirtualBasePath = process.cwd();
        }

        // Add bundles
        if (config.bundle) {
            for (const name in config.bundle) {
                if (config.bundle.hasOwnProperty(name)) {
                    const bundle = config.bundle[name];
                    // JS
                    if (bundle.scripts) {
                        let paths = [];
                        for (const path of bundle.scripts)
                            paths.push(resolvePath(config.BundlesVirtualBasePath + "/" + path));
                        this.ScriptBundles.set(name, paths);
                    }

                    // CSS
                    if (bundle.styles) {
                        let paths = [];
                        for (const path of bundle.styles)
                            paths.push(resolvePath(config.BundlesVirtualBasePath + "/" + path));
                        this.StyleBundles.set(name, paths);
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
        // Try to resolve a virtual path
        for (const [index, [oldPathStart, newPathStart]] of this.PathTransforms.entries()) {
            if (path.startsWith(oldPathStart))
                return [resolvePath(path.replace(oldPathStart, newPathStart)), index];
        }

        // No matches, lowest preference
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
                // Grab virtual path
                const [virtualPath, preference] = this.ResolveVirtualPath(chunk.path);

                // Add to resolved files (handling collisions according to preference)
                if (this.ResolvedFiles.has(virtualPath)) {
                    if (this.ResolvedFiles.get(virtualPath)[1] < preference)
                        this.ResolvedFiles.set(virtualPath, [chunk, preference]);
                }
                else this.ResolvedFiles.set(virtualPath, [chunk, preference]);
            }
            else {
                // Push incompatible chunk on through
                this.push(chunk);
            }

            // Indicate transform is complete
            callback();
        }
        catch (error) {
            // Shouldn't ever hit this, but ensures errors are piped properly in the worst case scenario.
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
            let [chunks, resultsMap] = await BundlesProcessor(this.ResolvedFiles, this.ScriptBundles, this.Bundlers.Scripts);

            for (const chunk of chunks)
                this.push(chunk);

            for (const [name, paths] of resultsMap)
                this.BundleResultsMap.set(name, paths);

            // Styles
            [chunks, resultsMap] = await BundlesProcessor(this.ResolvedFiles, this.StyleBundles, this.Bundlers.Styles);
            
            for (const chunk of chunks)
                this.push(chunk);

            for (const [name, paths] of resultsMap)
                this.BundleResultsMap.set(name, paths);

            // Push resolved files on through
            for (const [virtualPath, [chunk]] of this.ResolvedFiles) {
                this.push(chunk);
            }
            this.ResolvedFiles.clear();

            if (this.BundleResultsCallback)
                this.BundleResultsCallback(this.BundleResultsMap);

            callback();
        }
        catch (error) {
            // Shouldn't ever hit this, but ensures errors are piped properly in the worst case scenario.
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
    (src: Readable, name: string): Transform;
}
