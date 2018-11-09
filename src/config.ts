import * as Vinyl from "vinyl";
import { Bundle, RawConfig } from "./raw-config";

/**
 * Validates user config, filling in defaults as necessary, and then serves as wrapper.
 */
export default class Config {
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
                    this.SetBundle(bundleName, rawConfig.bundle[bundleName]);
            }
        }
    }

    /**
     * Sets the specified bundle.
     * @param name Name of bundle (used as map key)
     * @param bundle Bundle to read data from
     */
    private SetBundle(name: string, bundle: Bundle) {
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
        return "";
    }

    /**
     * 
     * @param currentFile 
     * @param newFile 
     */
    public ResolvePreferedFile(currentFile: Vinyl, newFile: Vinyl): Vinyl {
        return new Vinyl();
    }
}
