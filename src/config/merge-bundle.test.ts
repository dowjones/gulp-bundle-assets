import test from "ava";
import MergeBundle from "./merge-bundle";
import { Bundle } from "./config";

/**
 * Should return empty results.
 */
test("Empty objects", t => {
    const existingBundle: Bundle = {};
    const nextBundle: Bundle = {};
    const output: Bundle = {};
    t.deepEqual(MergeBundle(existingBundle, nextBundle), output);
});

/**
 * Should return incoming bundle (2nd input) when no collision rule is set (replace).
 */
test("No collision rule set", t => {
    const existingBundle: Bundle = {
        scripts: [
            "foo.js"
        ],
        styles: [
            "foo.css"
        ]
    };
    const nextBundle: Bundle = {
        scripts: [
            "bar.js",
            "zeta.js"
        ]
    };
    const output: Bundle = {
        scripts: [
            "bar.js",
            "zeta.js"
        ]
    };
    t.deepEqual(MergeBundle(existingBundle, nextBundle), output);
});

/**
 * Should return incoming bundle (2nd input) when replace collision rule is set.
 */
test("Collision rule set to replace.", t => {
    const existingBundle: Bundle = {
        scripts: [
            "foo.js"
        ]
    };
    const nextBundle: Bundle = {
        scripts: [
            "bar.js",
            "zeta.js"
        ],
        styles: [
            "foo.css"
        ],
        options: {
            sprinkle: {
                onCollision: "replace"
            }
        }
    };
    const output: Bundle = {
        scripts: [
            "bar.js",
            "zeta.js"
        ],
        styles: [
            "foo.css"
        ],
        options: {
            sprinkle: {
                onCollision: "replace"
            }
        }
    };
    t.deepEqual(MergeBundle(existingBundle, nextBundle), output);
});

/**
 * Should return results of a logical merge of the bundles when merge collision rule is used.
 * Merged arrays should be concatenated with contents of first being at top.
 */
test("Collision rule set to merge without duplicate resources", t => {
    const existingBundle: Bundle = {
        scripts: [
            "foo.js"
        ]
    };
    const nextBundle: Bundle = {
        scripts: [
            "bar.js",
            "zeta.js"
        ],
        styles: [
            "foo.css"
        ],
        options: {
            sprinkle: {
                onCollision: "merge"
            }
        }
    };
    const output: Bundle = {
        scripts: [
            "foo.js",
            "bar.js",
            "zeta.js"
        ],
        styles: [
            "foo.css"
        ],
        options: {
            sprinkle: {
                onCollision: "merge"
            }
        }
    };
    t.deepEqual(MergeBundle(existingBundle, nextBundle), output);
});

/**
 * Should return results of a logical merge of the bundles when merge collision rule is used.
 * Merged arrays should be concatenated with contents of first being at top, and later duplicates removed.
 */
test("Collision rule set to merge with duplicate resources", t => {
    const existingBundle: Bundle = {
        scripts: [
            "foo.js"
        ],
        styles: [
            "test.css"
        ]
    };
    const nextBundle: Bundle = {
        scripts: [
            "bar.js",
            "foo.js",
            "zeta.js"
        ],
        styles: [
            "test.css"
        ],
        options: {
            sprinkle: {
                onCollision: "merge"
            }
        }
    };
    const output: Bundle = {
        scripts: [
            "foo.js",
            "bar.js",
            "zeta.js"
        ],
        styles: [
            "test.css"
        ],
        options: {
            sprinkle: {
                onCollision: "merge"
            }
        }
    };
    t.deepEqual(MergeBundle(existingBundle, nextBundle), output);
});

/**
 * Should return results of a logical merge of the bundles when merge collision rule is used.
 * Merged arrays should be concatenated with contents of first being at top, and later duplicates removed.
 */
test("Collision rule set to merge with empty target bundle", t => {
    const existingBundle: Bundle = {};
    const nextBundle: Bundle = {
        scripts: [
            "bar.js",
            "foo.js",
            "zeta.js"
        ],
        options: {
            sprinkle: {
                onCollision: "merge"
            }
        }
    };
    const output: Bundle = {
        scripts: [
            "bar.js",
            "foo.js",
            "zeta.js"
        ],
        options: {
            sprinkle: {
                onCollision: "merge"
            }
        }
    };
    t.deepEqual(MergeBundle(existingBundle, nextBundle), output);
});

/**
 * Should return target bundle (1st input) when ignore collision rule is used.
 */
test("Collision rules set to ignore", t => {
    const existingBundle: Bundle = {
        scripts: [
            "foo.js"
        ]
    };
    const nextBundle: Bundle = {
        scripts: [
            "bar.js",
            "zeta.js"
        ],
        styles: [
            "foo.css"
        ],
        options: {
            sprinkle: {
                onCollision: "ignore"
            }
        }
    };
    const output: Bundle = {
        scripts: [
            "foo.js"
        ]
    };
    t.deepEqual(MergeBundle(existingBundle, nextBundle), output);
});

/**
 * Should throw an error when error collision rule is set.
 */
test("Collision rule set to error", t => {
    const existingBundle: Bundle = {
        scripts: [
            "foo.js"
        ]
    };
    const nextBundle: Bundle = {
        scripts: [
            "bar.js",
            "zeta.js"
        ],
        styles: [
            "foo.css"
        ],
        options: {
            sprinkle: {
                onCollision: "error"
            }
        }
    };
    t.throws(
        () => MergeBundle(existingBundle, nextBundle),
        "The bundle has been previously defined, and the bundle's 'onCollision' property is set to 'error'."
    );
});

/**
 * Should use collision rules of incoming bundle.
 */
test("Ignore collision rule on target bundle", t => {
    const existingBundle: Bundle = {
        scripts: [
            "foo.js"
        ],
        options: {
            sprinkle: {
                onCollision: "error"
            }
        }
    };
    const nextBundle: Bundle = {
        scripts: [
            "bar.js",
            "zeta.js"
        ],
        styles: [
            "foo.css"
        ]
    };
    const output: Bundle = {
        scripts: [
            "bar.js",
            "zeta.js"
        ],
        styles: [
            "foo.css"
        ]
    };
    t.notThrows(
        () => MergeBundle(existingBundle, nextBundle),
        "The bundle has been previously defined, and the bundle's 'onCollision' property is set to 'error'."
    );
    t.deepEqual(MergeBundle(existingBundle, nextBundle), output);

});
