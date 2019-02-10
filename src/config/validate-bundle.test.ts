import test from "ava";
import { Bundle } from "./config";
import ValidateBundle from "./validate-bundle";

/**
 * Should complete without throwing.
 */
test("Empty object", t => {
    t.notThrows(() => ValidateBundle({}, "test"));
});

/**
 * Should thow if the bundle is not an object.
 */
test("Non-object bundle", t => {
    const bundle: any = "a string";
    t.throws(
        () => ValidateBundle(bundle, "test"),
        "Property bundle>test must be an object and not null."
    );
});

/**
 * Should throw if the bundle name is not a string.
 */
test("Non-string bundle name", t => {
    const bundleName: any = 22;
    t.throws(
        () => ValidateBundle({}, bundleName),
        "Bundle name must be a string."
    );
});

/**
 * Should throw if the scripts property of bundle is not an array.
 */
test("Non-array for scripts", t => {
    const bundle: any = {
        scripts: "a string"
    };
    t.throws(
        () => ValidateBundle(bundle, "test"),
        "Property bundle>test>scripts must be an array."
    );
});

/**
 * Should throw if an index of scripts array of bundle is not a string.
 */
test("Array containing non-strings for scripts", t => {
    const bundle: any = {
        scripts: [
            "foo.js",
            () => "magic.js",
            22
        ]
    };
    t.throws(
        () => ValidateBundle(bundle, "test"),
        "All indexes of bundle>test>scripts must be a string."
    );
});

/**
 * Should complete without throwing.
 */
test("Valid array for scripts", t => {
    const bundle: Bundle = {
        scripts: [
            "foo.js",
            "bar.js"
        ]
    };
    t.notThrows(() => ValidateBundle(bundle, "test"));
});

/**
 * Should throw if the styles property of bundle is not an array.
 */
test("Non-array for styles", t => {
    const bundle: any = {
        styles: "a string"
    };
    t.throws(
        () => ValidateBundle(bundle, "test"),
        "Property bundle>test>styles must be an array."
    );
});

/**
 * Should throw if an index of styles array of bundle is not a string.
 */
test("Array containing non-strings for styles", t => {
    const bundle: any = {
        styles: [
            "foo.css",
            () => "magic.css",
            22
        ]
    };
    t.throws(
        () => ValidateBundle(bundle, "test"),
        "All indexes of bundle>test>styles must be a string."
    );
});

/**
 * Should complete without throwing.
 */
test("Valid array for styles", t => {
    const bundle: Bundle = {
        styles: [
            "foo.css",
            "bar.css"
        ]
    };
    t.notThrows(() => ValidateBundle(bundle, "test"));
});

/**
 * Should throw if the options property of bundle is not an object.
 */
test("Non-object for options", t => {
    const bundle: any = {
        options: 22
    };
    t.throws(
        () => ValidateBundle(bundle, "test"),
        "Property bundle>test>options must be an object and not null."
    );
});

/**
 * Should throw if the sprinkle property of options of bundle is not an object.
 */
test("Non-object for options>sprinkle", t => {
    const bundle: any = {
        options: {
            sprinkle: 22
        }
    };
    t.throws(
        () => ValidateBundle(bundle, "test"),
        "Property bundle>test>options>sprinkle must be an object and not null."
    );
});

/**
 * Should complete without throwing for all valid collision rules.
 * Should throw when given an invalid collision rule.
 */
test("All possible collision rules", t => {
    // replace
    const bundle: Bundle = {
        options: {
            sprinkle: {
                onCollision: "replace"
            }
        }
    };
    t.notThrows(() => ValidateBundle(bundle, "test"));
    // merge
    bundle.options.sprinkle.onCollision = "merge";
    t.notThrows(() => ValidateBundle(bundle, "test"));
    // error
    bundle.options.sprinkle.onCollision = "error";
    t.notThrows(() => ValidateBundle(bundle, "test"));
    // ignore
    bundle.options.sprinkle.onCollision = "ignore";
    t.notThrows(() => ValidateBundle(bundle, "test"));

    // Bad
    bundle.options.sprinkle.onCollision = "an invalid collision reaction";
    t.throws(
        () => ValidateBundle(bundle, "test"),
        "Property bundle>test>options>sprinkle>onCollision must be a valid rule."
    );
});

/**
 * Should throw if the sprinkle property of options of bundle is not an object.
 */
test("Non-string for options>sprinkle>onCollision", t => {
    const bundle: any = {
        options: {
            sprinkle: {
                onCollision: {
                    is: "a complicated beast"
                }
            }
        }
    };
    t.throws(
        () => ValidateBundle(bundle, "test"),
        "Property bundle>test>options>sprinkle>onCollision must be a string."
    );
});
