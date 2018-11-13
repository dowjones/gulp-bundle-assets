import PluginError from "plugin-error";
import { RawConfig, Bundle } from "./raw-config";
import { PluginName } from "./plugin-details";
import { Transform, TransformCallback } from "stream";
import * as Vinyl from "vinyl";
import { resolve as resolvePath } from "path";
import Catchment from "catchment";

// Foward public exports
export { MergeRawConfigs, ValidateRawConfig } from "./raw-config";

// TODO How do vinyl files get renamed?

export default class Bundler extends Transform {

    /**
     * Tracks all files resolved within virtual directory tree.
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
    public ResultsMap: Map<string, string> = new Map();

    /**
     * 
     * @param config Raw (but valid) configuration file used for bundle resolution.
     * @param joiner Object capable of generating the Transform streams needed for generation of final bundles.
     */
    constructor(config: RawConfig, joiner: Joiner) {
        super();

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
                    if (bundle.scripts)
                    this.ScriptBundles.set(name, bundle.scripts);

                    // CSS
                    if (bundle.styles)
                        this.StyleBundles.set(name, bundle.styles);
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
            let file: (Vinyl & VinylExtension) = chunk as (Vinyl & VinylExtension);
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
     * 
     * @param callback 
     */
    _flush(callback: TransformCallback): void {
        // Track names of generated bundles (for integrations map)

        // Create bundles

        // NOTE Use "catchment" to grab bundle stream results
        // Script bundles
        for (const paths of this.ScriptBundles) {
            // Get files

            // Create joiner instance

            // Push in data and catch result

        }

        // Style bundles
        for (const paths of this.StyleBundles) {
            // Get files

            // Create joiner instance

            // Push in data and catch result

        }

        // Indicate flush is complete
        callback();
    }
}

/**
 * 
 */
export interface Joiner {
    /**
     * Returns a Transform that will handle bundling of script resources.
     * @param name Name of bundle.
     */
    Scripts(name: string): Transform;

    /**
     * Returns a Transform that will handle bundling of style resources.
     * @param name Name of bundle.
     */
    Styles(name: string): Transform;
}

/**
 * An extension interface used for providing type hinting to modified Vinyl files.
 * This is intended for internal use only, so extensions should be removed once they are no longer needed.
 */
interface VinylExtension {
    /**
     * Represents the Vinyl instances priority.
     * Used to override files correctly.
     */
    Precedence: number
}
