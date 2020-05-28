import { Config } from "./config.js";
import MergeBundle from "./merge-bundle.js";
import extend from "just-extend";
import ExtendedError from "errlop";

/**
 * Merges a collection of configurations.
 * No validation is conducted, it is expected that provided inputs are all valid.
 *
 * `bundle->(BundleName)->options->sprinkle->onCollision = (replace|merge|ignore|error)` may be used to modify treatment of collided bundles.
 * @param rawConfigs - Raw (untransformed) configurations to merge.
 * @public
 */
export default function MergeConfigs(rawConfigs: Config[]): Config {
    // No point doing processing if we've got only 1 item
    if (rawConfigs.length === 1) return rawConfigs[0];

    let outConfig: Config = {};

    // Merge configs into base
    rawConfigs.forEach(config => {
        // Prevent modification of input
        let nextConfig = extend(true, {}, config);

        // Merge all bundle definitions into nextConfig (to handle collision logic correctly)
        if (outConfig.bundle) {
            // Ensure nextConfig has a bundle key
            if (!nextConfig.bundle)
                nextConfig.bundle = {};

            for (const bundleName of Object.getOwnPropertyNames(outConfig.bundle)) {
                // Conduct merge if already defined on nextConfig
                if (nextConfig.bundle.hasOwnProperty(bundleName)) {
                    try {
                        nextConfig.bundle[bundleName] = MergeBundle(outConfig.bundle[bundleName], nextConfig.bundle[bundleName]);
                    }
                    catch (exception) {
                        // @ts-ignore
                        throw new ExtendedError.default(`Exception raised while merging bundle '${bundleName}' in the raw configuration at index '${rawConfigs.indexOf(config)}'.`, exception);
                    }
                }
                // Otherwise just set it
                else nextConfig.bundle[bundleName] = outConfig.bundle[bundleName];

                // Remove existing bundle from outConfig
                delete outConfig.bundle[bundleName];
            }
        }

        // Merge objects
        extend(true, outConfig, nextConfig);
    });

    return outConfig;
}
