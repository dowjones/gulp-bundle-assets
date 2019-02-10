import { resolve as resolvePath } from "path";
import { Config } from "./config";
import ValidateBundle from "./validate-bundle";

/**
 * Throws an exception if the provided raw config contains invalid data.
 * @param config Raw configuration to validate.
 */
export default function ValidateConfig(config: Config): void {
    // If bundle key exists, value must be an object
    if ("bundle" in config) {
        const bundles = config.bundle;

        if (typeof bundles !== "object" || bundles === null) {
            throw new Error(`Property "bundle" must be an object and not null.`);
        }
        else {
            // Each property must be an object (for owned properties)
            for (const bundleName in bundles) {
                if (bundles.hasOwnProperty(bundleName)) {
                    ValidateBundle(bundles[bundleName], bundleName);
                }
            }
        }
    }

    // If PathTransform key exists, value must be array
    if ("VirtualPathRules" in config) {
        const virtualPathRules = config.VirtualPathRules;

        if (!Array.isArray(virtualPathRules)) {
            throw new Error(`Property "VirtualPathRules" must be an object and not null.`);
        }
        else {
            // Matchers must all be unique, and all values must be not empty
            const matchers = [];
            for (const [matcher, replacement] of virtualPathRules) {
                // Must be non-empty
                if (matcher === "") {
                    throw new Error(`Value matcher of property "VirtualPathRules" is empty.`);
                }
                if (replacement === "") {
                    throw new Error(`Value replacement of property "VirtualPathRules" is empty.`);
                }

                const resolved = resolvePath(matcher);
                if (matchers.indexOf(resolved) !== -1) {
                    throw new Error(`Value matcher of property "VirtualPathRules" has a duplicate "${matcher}" which resolves to "${resolved}"`);
                }
                else
                    matchers.push(resolved);
            }
        }
    }
}
