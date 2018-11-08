import * as PluginError from "plugin-error";
import Config, { RawConfig } from "./config";
import { PluginName } from "./plugin-details";
import { Transform, TransformCallback } from "stream";
import * as Vinyl from "vinyl";

// Foward public functions
export { ValidateRawConfig } from "./config";

export default class Bundler extends Transform {
    private Config: Config;

    /**
     * Tracks all files resolved within virtual directory tree.
     */
    private VirtualDirTree: Map<string, Vinyl>;

    /**
     * 
     * @param config Raw (but valid) configuration file used for bundle resolution.
     * @param joiner Object capable of generating the Transform streams needed for generation of final bundles.
     */
    constructor(config: RawConfig, joiner: Joiner) {
        super();
        try {
            // Process configuration
            this.Config = new Config(config);

            // Create virtual directory
            this.VirtualDirTree = new Map();
        }
        catch (exception) {
            throw new PluginError(PluginName, exception);
        }
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
            const virtualPath = this.Config.ResolveVirtualPath(chunk.path);

            // See if anything lines up with it in the VirtualDirTree and handle accordingly
            if (this.VirtualDirTree.has(virtualPath)) {
                // Let configuration resolve collision
                this.VirtualDirTree.set(
                    virtualPath,
                    this.Config.ResolvePreferedFile(this.VirtualDirTree.get(virtualPath), chunk));
            }
            else this.VirtualDirTree.set(virtualPath, chunk);
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
        // Make sure all bundle requirements are satisfied

        // Create bundles
    }
}

/**
 * Merges a collection of configurations.
 * 
 * Treatment of merged bundles within the configuration files can be modified by setting `bundle->(BundleName)->options->sprinkle->onCollision = (replace|merge|ignore|error)` where `replace` replaces the existing bundle definition, `merge` merges (order can at times get a little funny), `ignore` only applies the new definition if there is nothing already set, and `error` simply throws if a bundle is already defined.
 */
export function MergeConfigs(rawConfigs: RawConfig[]): RawConfig {
    let rawConfig: RawConfig = {};

    // Merge configs into base
    try {
        rawConfigs.forEach(config => {
            
        });
    }
    catch (exception) {
        throw new PluginError(PluginName, exception);
    }

    return rawConfig;
}

/**
 * 
 */
export interface Joiner {
    /**
     * Returns a Transform that will handle bundling of style resources.
     * @param name Name of bundle.
     */
    Styles(name: string): Transform;

    /**
     * Returns a Transform that will handle bundling of script resources.
     * @param name Name of bundle.
     */
    Scripts(name: string): Transform;
}
