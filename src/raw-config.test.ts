import test from "ava";
import { MergeRawConfigs, RawConfig, Bundle, MergeBundle } from "./raw-config";

/**
 * MergeConfigs(RawConfig[]):RawConfig
 */

test("MergeConfigs(RawConfig[]) with single empty object", t => {
	t.deepEqual(MergeRawConfigs([{}]), {});
});

test("MergeConfigs(RawConfig[]) with multiple empty objects", t => {
	t.deepEqual(MergeRawConfigs([{}, {}, {}]), {});
});

test("MergeConfigs(RawConfig[]) with single object", t => {
	const input1: RawConfig = {
		bundle: {
			testBundle: {
				scripts: [
					"foo.js"
				]
			}
		}
	};
	const output: RawConfig = {
		bundle: {
			testBundle: {
				scripts: [
					"foo.js"
				]
			}
		}
	};

	t.deepEqual(MergeRawConfigs([input1]), output);
});

test("MergeConfigs(RawConfig[]) with multiple objects", t => {
	const input1: RawConfig = {
		bundle: {
			testBundle: {
				scripts: [
					"foo.js"
				]
			}
		}
	};
	const input2: RawConfig = {
		bundle: {
			testBundle: {
				scripts: [
					"bar.js"
				]
			}
		}
	};
	const input3: RawConfig = {
		bundle: {
			testBundle: {
				styles: [
					"foo.css"
				]
			}
		}
	};
	const output: RawConfig = {
		bundle: {
			testBundle: {
				styles: [
					"foo.css"
				]
			}
		}
	};

	t.deepEqual(MergeRawConfigs([input1, input2, input3]), output);
});

test("MergeConfigs(RawConfig[]) identifies error source when MergeBundle(Bundle,Bundle) fails", t => {
	const input1: RawConfig = {
		bundle: {
			testBundle: {
				scripts: [
					"foo.js"
				]
			}
		}
	};
	const input2: RawConfig = {
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

	t.throws(() => MergeRawConfigs([input1, input2]), "Exception raised while merging bundle 'testBundle' in the raw configuration at index '1'.\nError: Unexpected input 'badCollisionHandler' for 'onCollision' option of next bundle.");
});

/**
 * MergeBundle(Bundle,Bundle):Bundle
 */

test("MergeBundle(Bundle,Bundle) with empty objects", t => {
	const existingBundle: Bundle = {

	};
	const nextBundle: Bundle = {

	};
	const output: Bundle = {

	};
	t.deepEqual(MergeBundle(existingBundle, nextBundle), output);
});

test("MergeBundle(Bundle,Bundle) with no collision rules set", t => {
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
	t.deepEqual(MergeBundle(existingBundle, nextBundle), output);
});

test("MergeBundle(Bundle,Bundle) with merge collision rules set", t => {
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
			"bar.js",
			"zeta.js",
			"foo.js"
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

test("MergeBundle(Bundle,Bundle) with merge collision rules set and arrays with common items", t => {
	const existingBundle: Bundle = {
		scripts: [
			"foo.js"
		]
	};
	const nextBundle: Bundle = {
		scripts: [
			"bar.js",
			"foo.js",
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
			"bar.js",
			"foo.js",
			"zeta.js",
			"foo.js"
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

test("MergeBundle(Bundle,Bundle) with ignore collision rules set", t => {
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

test("MergeBundle(Bundle,Bundle) with ignore collision rules set", t => {
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

test("MergeBundle(Bundle,Bundle) with error collision rules set", t => {
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
	t.throws(() => MergeBundle(existingBundle, nextBundle), "The bundle has been previously defined, and the bundle's 'onCollision' property is set to 'error'.");
});
