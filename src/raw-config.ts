import DeepAssign from "deep-assign";
import Merge from "merge-array-object";

/**
 * Merges a collection of configurations.
 * No validation is conducted, it is expected that provided inputs are all valid.
 * 
 * `bundle->(BundleName)->options->sprinkle->onCollision = (replace|merge|ignore|error)` may be used to modify treatment of collided bundles.
 */
export function MergeRawConfigs(rawConfigs: RawConfig[]): RawConfig {
    // No point doing processing if we've got only 1 item
    if (rawConfigs.length === 1) return rawConfigs[0];

    let outConfig: RawConfig = {};

    // Merge configs into base
    rawConfigs.forEach(config => {
        // Prevent modification of input
        let nextConfig = DeepAssign({}, config);

        // Merge all bundle definitions into nextConfig, leaving nothing in rawConfig (permits much easier merge)
        if (outConfig.bundle) {
            // Ensure nextConfig has a bundle key
            if (!nextConfig.bundle)
                nextConfig.bundle = {};

            for (const bundleName in outConfig.bundle) {
                if (outConfig.bundle.hasOwnProperty(bundleName)) {
                    // Conduct merge if already defined on nextConfig
                    if (nextConfig.bundle.hasOwnProperty(bundleName)) {
                        try {
                            nextConfig.bundle[bundleName] = MergeBundle(outConfig.bundle[bundleName], nextConfig.bundle[bundleName]);
                        }
                        catch (exception) {
                            throw new Error(`Exception raised while merging bundle '${bundleName}' in the raw configuration at index '${rawConfigs.indexOf(config)}'.\n${exception}`);
                        }
                    }
                    // Otherwise just set it
                    else nextConfig.bundle[bundleName] = outConfig.bundle[bundleName];

                    // Remove existing bundle from outConfig
                    delete outConfig.bundle[bundleName];
                }
            }
        }

        // Merge objects
        DeepAssign(outConfig, nextConfig);
    });

    return outConfig;
}

/**
 * Merges 2 bundles, respecting the collision logic of the second bundle if specified.
 * @param existingBundle Bundle to merge into.
 * @param nextBundle Bundle bringing new content.
 */
export function MergeBundle(existingBundle: Bundle, nextBundle: Bundle): Bundle {
    // Determine collision resolution strategy
    let collisionReaction = CollisionReactions.replace;

    if (nextBundle.options
        && nextBundle.options.sprinkle
        && nextBundle.options.sprinkle.onCollision) {
        collisionReaction = CollisionReactions[nextBundle.options.sprinkle.onCollision];
    }

    // Do merge
    switch (collisionReaction) {
        // Replace - Return the next bundle
        case CollisionReactions.replace:
            return nextBundle;
        // Merge - Return the merged result (uses merge-array-object for backwards compatibility)
        case CollisionReactions.merge:
            // TODO Worth noting that there is no types for Merge currently
            return Merge(existingBundle, nextBundle);
        // Ignore - Return existing bundle
        case CollisionReactions.ignore:
            return existingBundle;
        // Error, better known as EVERYBODY PANIC!
        case CollisionReactions.error:
            throw new Error(`The bundle has been previously defined, and the bundle's 'onCollision' property is set to 'error'.`);
        default:
            throw new Error(`Unexpected input '${nextBundle.options.sprinkle.onCollision}' for 'onCollision' option of next bundle.`);
    }
}

/**
 * Root object of raw configuration.
 */
export interface RawConfig {
    bundle?: Bundles;
    PathMap?: Map<string, string>;
}

/**
 * Map of bundles.
 */
interface Bundles {
    [x: string]: Bundle;
}

/**
 * Represents an asset bundle
 */
export interface Bundle {
    scripts?: string[];
    styles?: string[];
    options?: Options;
}

/**
 * Represents an asset bundles root options node.
 */
interface Options {
    sprinkle?: SprinkleOptions;
}

/**
 * Options relevent to UserFrosting's Sprinkle system.
 */
interface SprinkleOptions {
    /**
     * 
     */
    onCollision?: CollisionReactions | string;
}

/**
 * Rules for how a bundle collision may be treated.
 */
enum CollisionReactions {
    /**
     * Replace the existing bundle.
     */
    replace,
    /**
     * Merge with the existing bundle, with order preserved as much as possible.
     * Colliding arrays will be prepended to the existing, keep an eye out for duplicates.
     */
    merge,
    /**
     * Leave the existing bundle alone.
     */
    ignore,
    /**
     * Throw an error on encountering an already defined bundle.
     */
    error,
}
