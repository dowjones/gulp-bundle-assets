import PluginError from "plugin-error";
import Config, { RawConfig, CollisionReactions } from "./config";
import { PluginName } from "./plugin-details";
import { Transform, TransformCallback } from "stream";
import * as Vinyl from "vinyl";
import DeepAssign from "deep-assign";
import Merge from "merge-array-object";

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
 * No validation is conducted, it is expected that provided inputs are all valid.
 * 
 * `bundle->(BundleName)->options->sprinkle->onCollision = (replace|merge|ignore|error)` may be used to modify treatment of collided bundles.
 * 
 * @see {@link RawConfig} for more details.
 */
export function MergeConfigs(rawConfigs: RawConfig[]): RawConfig {
    // No point doing processing if we've got only 1 item
    if (rawConfigs.length === 1) return rawConfigs[0];

    let rawConfig: RawConfig = {};

    // Merge configs into base
    try {
        rawConfigs.forEach(config => {
            // Copy current config
            let currentConfig = DeepAssign({}, config);

            // Merge all bundle definitions into currentConfig, leaving nothing in rawConfig (permits much easier merge)
            // TODO Move all bundle files onto currentConfig, leaving nothing in rawConfig (premits much easier merge)
            if (rawConfig.bundle) {
                // Ensure currentConfig has a bundle key
                if (!currentConfig.bundle)
                    currentConfig.bundle = {};

                for (const bundleName in rawConfig.bundle) {
                    if (rawConfig.bundle.hasOwnProperty(bundleName)) {
                        const bundle = rawConfig.bundle[bundleName];

                        // Conduct merge if already defined on currentConfig
                        if (currentConfig.bundle.hasOwnProperty(bundleName)) {
                            const currentBundle = currentConfig.bundle[bundleName];

                            // Determine collision resolution strategy
                            let collisionReaction = CollisionReactions.Replace;

                            if (currentBundle.options
                                && currentBundle.options.sprinkle
                                && currentBundle.options.sprinkle.onCollision) {
                                collisionReaction = CollisionReactions[currentBundle.options.sprinkle.onCollision];
                            }

                            // Do merge
                            switch (collisionReaction) {
                                // Replace (intentionally does nothing)
                                case CollisionReactions.Replace:
                                    break;
                                // Merge (uses merge-array-object for backwards compatibility)
                                case CollisionReactions.Merge:
                                    // TODO Worth noting that there is no types for Merge currently
                                    currentConfig.bundle[bundleName] = Merge(bundle, currentBundle);
                                    break;
                                // Ignore (copy existing bundle over)
                                case CollisionReactions.Ignore:
                                    currentConfig.bundle[bundleName] = bundle;
                                    break;
                                // Error, better known as EVERYBODY PANIC!
                                case CollisionReactions.Error:
                                    throw new Error(`The bundle '${bundleName}' in the raw configuration at index '${rawConfigs.indexOf(config)}' has been previously defined, and the bundle's 'onCollision' property is set to 'error'.`);
                                default:
                                    throw new Error(`Unexpected input '${collisionReaction}' for 'onCollision' for the bundle '${bundleName}' in the raw configuration at index '${rawConfigs.indexOf(config)}'.`);
                            }
                        }
                        // Otherwise just set it
                        else {
                            currentConfig.bundle[bundleName] = bundle;
                        }

                        // Remove existing bundle from rawConfig
                        delete rawConfig.bundle[bundleName];
                    }
                }
            }

            // Merge objects
            DeepAssign(rawConfig, currentConfig);
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
