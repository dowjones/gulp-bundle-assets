import * as Vinyl from "vinyl";

/**
 * Validates user config, filling in defaults as necessary, and then serves as wrapper.
 * @internal
 */
export class Config {
    /**
     * Used in conversion of canonical paths to virtual paths.
     * EG:
     * - ../node_modules -> ./vendor
     * - ../bower_components -> ./vendor
     */
    private PathMap?: Map<string, string>;

    /**
     * Script bundles to build.
     */
    private ScriptBundles: Map<string, string[]> = new Map();

    /**
     * Style bundles to build.
     */
    private StyleBundles: Map<string, string[]> = new Map();

    /**
     * @param rawConfig Raw configuration object to construct class with.
     */
    constructor(rawConfig: RawConfig) {
        // Bundles
        if (rawConfig.bundle) {
            for (const bundleName in rawConfig.bundle) {
                if (rawConfig.bundle.hasOwnProperty(bundleName))
                    this.AddBundle(bundleName, rawConfig.bundle[bundleName]);
            }
        }
    }

    /**
     * 
     * @param name 
     * @param bundle 
     */
    private AddBundle(name: string, bundle: Bundle) {
        // JS
        if (bundle.scripts)
            this.ScriptBundles.set(name, bundle.scripts);

        // CSS
        if (bundle.styles)
            this.StyleBundles.set(name, bundle.styles);
    }

    /**
     * 
     * @param absolutePath 
     */
    public ResolveVirtualPath(absolutePath: string): string | null {

    }

    /**
     * 
     * @param currentFile 
     * @param newFile 
     */
    public ResolvePreferedFile(currentFile: Vinyl, newFile: Vinyl): Vinyl {

    }
}

/**
 * Throws an exception 
 * @param config 
 */
export function ValidateRawConfig(config: RawConfig): void {
// If bundle key exists, value must be an object
if ("bundle" in config) {
    const bundles = config.bundle;

    if (typeof bundles !== "object" || bundles === null)
        throw new Error("Property bundle must be an object and not null.");
    else

        // Each property must be an object (for owned properties)
        for (const bundleName in bundles) {
            if (bundles.hasOwnProperty(bundleName))
                ValidateBundle(bundles[bundleName], bundleName);
        }

}
}

/**
 * Throws an exception if the provided bundle is invalid.
 * @param bundle Bundle to analyse.
 * @param name Name of bundle.
 */
function ValidateBundle(bundle: Bundle, name: string): void {
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

// Everything onwards just 

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
interface Bundle {
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
    onCollision?: CollisionReactions;
}

/**
 * Rules for how a bundle collision may be treated.
 */
enum CollisionReactions {
    /**
     * Replace the existing bundle.
     */
    Replace = "replace",
    /**
     * Merge with the existing bundle, with order preserved as much as possible.
     */
    Merge = "merge",
    /**
     * Leave the existing bundle alone.
     */
    Ignore = "ignore",
    /**
     * Throw an error on encountering an already defined bundle.
     */
    Error = "error"
}
