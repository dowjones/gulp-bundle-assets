import PluginError = require("plugin-error");
import BundleConfig from "./bundle-config";
import PluginDetails from "./plugin-details";

/**
 * Validates user config, filling in defaults as necessary, and then serves as wrapper.
 * @internal
 */
export default class Config {
    private bundle: BundleConfig;
    private hasBundles: boolean = false;

    /**
     * @param rawConfig - Raw configuration file.
     */
    constructor(rawConfig: any = {}) {
        // We need to check everything manally. Static analysis can't help us here.

        // Object?
        if (typeof(rawConfig) !== "object") {
            throw new PluginError(PluginDetails.name, "Configuration must be an object.");
        }
        // Object!

        // Validate bundles if 'bundle' key exists.
        if (rawConfig.hasOwnProperty("bundle")) {
            // Actual validation (and abstration)
            this.bundle = new BundleConfig(rawConfig.bundle);
            // If we get this far, the bundle configuration was good.
            this.hasBundles = true;
        }
    }

    public get(): string {
        return "a string";
    }
}
