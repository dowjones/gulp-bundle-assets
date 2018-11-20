import Merge from "merge-array-object";
import Extend from "just-extend";

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
        let nextConfig = Extend({}, config) as RawConfig;

        // Merge all bundle definitions into nextConfig (to handle collision logic correctly)
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
        Extend(outConfig, nextConfig);
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
            // TODO Worth noting that there is no typing for Merge currently
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
 * Throws an exception if the provided raw config contains invalid data.
 * @param config Raw configuration to validate.
 */
export function ValidateRawConfig(config: RawConfig): void {
    // If bundle key exists, value must be an object
    if ("bundle" in config) {
        const bundles = config.bundle;

        if (typeof bundles !== "object" || bundles === null)
            throw new Error("Property bundle must be an object and not null.");
        else {
            // Each property must be an object (for owned properties)
            for (const bundleName in bundles) {
                if (bundles.hasOwnProperty(bundleName))
                    ValidateBundle(bundles[bundleName], bundleName);
            }
        }
    }

    // If PathTransform key exists, value must be array
    if ("PathTransform" in config) {
        // TODO Validate that provided transformations make sense (e.g. no empty strings)
    }
}

/**
 * Throws an exception if the provided bundle is invalid.
 * @param bundle Bundle to analyse.
 * @param name Name of bundle.
 */
export function ValidateBundle(bundle: Bundle, name: string): void {
    if (typeof name !== "string")
        throw new Error("Bundle name must be a string.");

    if (typeof bundle !== "object" || bundle === null)
        throw new Error(`Property bundle>${name} must be an object and not null.`);

    // If scripts key exists, it must be an array of strings
    if ("scripts" in bundle) {
        const scripts = bundle.scripts;

        if (!Array.isArray(scripts))
            throw new Error(`Property bundle>${name}>scripts must be an array.`);

        scripts.forEach(path => {
            if (typeof path !== "string")
                throw new Error(`All indexes of bundle>${name}>scripts must be a string.`);
        });
    }

    // If styles key exists, it must be an array of strings
    if ("styles" in bundle) {
        const styles = bundle.styles;

        if (!Array.isArray(styles))
            throw new Error(`Property bundle>${name}>styles must be an array.`);

        styles.forEach(path => {
            if (typeof path !== "string")
                throw new Error(`All indexes of bundle>${name}>styles must be a string.`);
        });
    }

    // If options key exists, it must be an object
    if ("options" in bundle) {
        const options = bundle.options;

        if (typeof options !== "object" || options === null)
            throw new Error(`Property bundle>${name}>options must be an object and not null.`);

        // If sprinkle key exists, value must be an object
        if ("sprinkle" in options) {
            const sprinkle = options.sprinkle;

            if (typeof sprinkle !== "object" || sprinkle === null)
                throw new Error(`Property bundle>${name}>options>sprinkle must be an object and not null.`);

            // If onCollision exists, value must be a string and match a set of values
            if ("onCollision" in sprinkle) {
                if (typeof sprinkle.onCollision !== "string")
                    throw new Error(`Property bundle>${name}>options>sprinkle>onCollision must be a string.`);
                if (["replace", "merge", "ignore", "error"].indexOf(sprinkle.onCollision) === -1)
                    throw new Error(`Property bundle>${name}>options>sprinkle>onCollision must be a valid rule.`);
            }
        }
    }
}

/**
 * Root object of raw configuration.
 */
export interface RawConfig {
    /**
     * Bundle definitions.
     */
    bundle?: Bundles;

    /**
     * Paths that are matched wihtin this array will be transformed. All paths should be relative, or undefined behaviour may occur.
     * Paths that become identical will be overriden according to position of the transform in the array (later overrides earlier).
     */
    PathTransforms?: [string, string][];

    /**
     * Base path to resolve bundle paths against. Defaults to current working directory.
     */
    BundlesBasePath?: string;

    /**
     * Base path to resolve path transformations against. Defaults to current working directory.
     */
    PathTransformBasePath?: string;
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
    error
}
