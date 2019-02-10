import test from "ava";
import MergeConfig from "./merge-configs";
import { Config } from "./config";

/**
 * Should return empty object.
 */
test("Single empty object", t => {
	t.deepEqual(MergeConfig([{}]), {});
});

/**
 * Should return empty object.
 */
test("Multiple empty objects", t => {
	t.deepEqual(MergeConfig([{}, {}, {}]), {});
});

/**
 * Should return object with empty bundle key.
 */
test("First object with bundle property and second object empty", t => {
	t.deepEqual(MergeConfig([{ bundle: {}}, {}]), { bundle: {}});
});

/**
 * Should return object equviliant to input.
 */
test("Single object", t => {
	const config: Config = {
		bundle: {
			testBundle: {
				scripts: [
					"foo.js"
				]
			}
		}
	};
	const expected: Config = {
		bundle: {
			testBundle: {
				scripts: [
					"foo.js"
				]
			}
		}
	};

	t.deepEqual(MergeConfig([config]), expected);
});

/**
 * Should return result of logical merge of inputs.
 * Bundles should be merged according to merge rules the incoming bundle defines, defaulting to replacement.
 */
test("Multiple objects", t => {
	const config1: Config = {
		bundle: {
			testBundle1: {
				scripts: [
					"foo.js"
				]
			}
		}
	};
	const config2: Config = {
		bundle: {
			testBundle2: {
				scripts: [
					"bar.js"
				]
			}
		}
	};
	const config3: Config = {
		bundle: {
			testBundle1: {
				styles: [
					"foo.css"
				]
			}
		}
	};
	const expected: Config = {
		bundle: {
			testBundle1: {
				styles: [
					"foo.css"
				]
            },
            testBundle2: {
				scripts: [
					"bar.js"
				]
			}
		}
	};

	t.deepEqual(MergeConfig([config1, config2, config3]), expected);
});

/**
 * Should throw when an invalid collision rule is specified on an incoming bundle.
 */
test("Colliding bundle with invalid collision rule on incoming bundle", t => {
	const config1: Config = {
		bundle: {
			testBundle: {
				scripts: [
					"foo.js"
				]
			}
		}
	};
	const config2: Config = {
		bundle: {
			testBundle: {
				scripts: [
					"bar.js"
				],
				options: {
					sprinkle: {
						onCollision: "badCollisionHandler"
					}
				}
			}
		}
	};

	t.throws(
        () => MergeConfig([config1, config2]),
        "Exception raised while merging bundle 'testBundle' in the raw configuration at index '1'.\n"
         + "Error: Unexpected input 'badCollisionHandler' for 'onCollision' option of next bundle."
    );
});

/**
 * Should now throw when an invalid collision rule is specified on a target bundle.
 */
test("Colliding bundle with invalid collision rule on target bundle", t => {
	const input1: Config = {
		bundle: {
			testBundle: {
				scripts: [
					"foo.js"
				],
				options: {
					sprinkle: {
						onCollision: "badCollisionHandler"
					}
				}
			}
		}
	};
	const input2: Config = {
		bundle: {
			testBundle: {
				scripts: [
					"bar.js"
				]
			}
		}
	};

	t.notThrows(() => MergeConfig([input1, input2]));
});
