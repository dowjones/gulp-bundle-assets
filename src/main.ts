import { resolve as resolvePath } from "path";
import PluginError from "plugin-error";
import { Transform, TransformCallback } from "stream";
import Vinyl from "vinyl";
import { BundlesProcessor } from "./bundles-processor";
import { PluginName } from "./plugin-details";
import { RawConfig } from "./raw-config";

// Foward public exports
export { MergeRawConfigs, ValidateRawConfig } from "./raw-config";

// TODO How do vinyl files get renamed?

export default class Bundler extends Transform {

    /**
     * Tracks all files resolved within virtual directory tree.
     * TODO Extensions should be removed once chunks leave the context of this package.
     */
    private ResolvedFiles: Map<string, (Vinyl & VinylExtension)> = new Map();

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
     * 
     */
    private Joiner: Joiner;

    /**
     * Map containing output filenames for each bundle.
     * Key is bundle name, value is the file path.
     */
    public ResultsMap: Map<string, string[]> = new Map();

    /**
     * 
     * @param config Raw (but valid) configuration file used for bundle resolution.
     * @param joiner Object capable of generating the Transform streams needed for generation of final bundles.
     */
    constructor(config: RawConfig, joiner: Joiner) {
        super({
            objectMode: true
        });

        // Extract path transformations (if set) and make canonical paths absolute
        if (config.PathTransforms) {
            for (const [path, vPath] of config.PathTransforms)
                this.PathTransforms.push([resolvePath(path), vPath]);
        }

        // Add bundles
        if (config.bundle) {
            for (const name in config.bundle) {
                if (config.hasOwnProperty(name)) {
                    const bundle = config.bundle[name];
                    // JS
                    if (bundle.scripts) {
                        let paths = [];
                        for (const path of bundle.scripts)
                            paths.push(resolvePath(path));
                        this.ScriptBundles.set(name, paths);
                    }

                    // CSS
                    if (bundle.styles) {
                        let paths = [];
                        for (const path of bundle.styles)
                            paths.push(resolvePath(path));
                        this.StyleBundles.set(name, paths);
                    }
                }
            }
        }

        this.Joiner = joiner;
    }

    /**
     * Attempts to create a virutal path from the provided path.
     * On failure, the provided path is returned.
     * @param path Absolute path to try and resolve.
     */
    private ResolveVirtualPath(path: string): [string, number] {
        // Try to resolve a virtual path
        for (const [index, [pathStart, vPathStart]] of this.PathTransforms.entries()) {
            if (path.startsWith(pathStart))
                return [path.replace(path, vPathStart), index];
        }

        // No matches
        return [path, 0];
    }

    /**
     * Collects copies of applicable files to later bundle.
     * 
     * @param chunk 
     * @param encoding 
     * @param callback 
     */
    _transform(chunk: any, encoding: string, callback: TransformCallback): void {
        if (Vinyl.isVinyl(chunk)) {
            // Grab virtual path
            const [virtualPath, precedence] = this.ResolveVirtualPath(chunk.path);

            // Extended chunk
            let file = chunk as (Vinyl & VinylExtension);
            file.path = virtualPath;
            file.Precedence = precedence;

            // Add to resolved files (handling collisions according to precedence)
            if (this.ResolvedFiles.has(file.path)) {
                if (this.ResolvedFiles.get(file.path).Precedence < file.Precedence)
                    this.ResolvedFiles.set(file.path, file);
            }
            else this.ResolvedFiles.set(file.path, file);
        }
        else {
            // Push incompatible chunk on through
            this.push(chunk);
        }

        // Indicate transform is complete
        callback();
    }

    /**
     * Does bundling and pushes resulting files into stream.
     * @param callback 
     */
    _flush(callback: TransformCallback): void {
        const bundleWork: Promise<[any[], Map<string, string[]>]>[] = [];

        // Scripts
        bundleWork.push(BundlesProcessor(this.ResolvedFiles, this.ScriptBundles, this.Joiner.Scripts));

        // Styles
        bundleWork.push(BundlesProcessor(this.ResolvedFiles, this.StyleBundles, this.Joiner.Styles));

        Promise.all(bundleWork)
            .then(results => {
                // Handle results
                for (const [chunks, vinylPaths] of results) {
                    // Add to ResultsMap
                    for (const [name, paths] of vinylPaths)
                        this.ResultsMap.set(name, paths);

                    // Push chunks through
                    for (const chunk of chunks) this.push(chunk);
                }

                // Push resolved files on through
                for (const [virtualPath, file] of this.ResolvedFiles) {
                    this.push(file);
                }
                this.ResolvedFiles.clear();

                callback();
            })
            .catch(error => callback(new PluginError(PluginName, error)));
    }
}

/**
 * 
 */
export interface Joiner {
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
 * An extension interface used for providing type hinting to modified Vinyl files.
 * This is intended for internal use only, so extensions should be removed once they are no longer needed.
 */
export interface VinylExtension {
    /**
     * Represents the Vinyl instances priority.
     * Used to override files correctly. We could just use the path history in Vinyl, however this is quicker.
     */
    Precedence: number
}

/**
 * A function that returns a stream that will be used to bundle assets.
 */
export interface BundlerStreamFactory {
    /**
     * @param name Name of bundle.
     */
    (name: string): Transform;
}
