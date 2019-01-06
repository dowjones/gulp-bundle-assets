import test from "ava";
import { MergeRawConfigs, Config, Bundle, MergeBundle, ValidateRawConfig, ValidateBundle } from "./config";

/**
 * MergeConfigs(RawConfig[]):RawConfig
 */

test("MergeConfigs(RawConfig[]):RawConfig with single empty object", t => {
	t.deepEqual(MergeRawConfigs([{}]), {});
});

test("MergeConfigs(RawConfig[]):RawConfig with multiple empty objects", t => {
	t.deepEqual(MergeRawConfigs([{}, {}, {}]), {});
});

test("MergeConfigs(RawConfig[]):RawConfig with single object", t => {
	const input1: Config = {
		bundle: {
			testBundle: {
				scripts: [
					"foo.js"
				]
			}
		}
	};
	const output: Config = {
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

test("MergeConfigs(RawConfig[]):RawConfig with multiple objects", t => {
	const input1: Config = {
		bundle: {
			testBundle: {
				scripts: [
					"foo.js"
				]
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
	const input3: Config = {
		bundle: {
			testBundle: {
				styles: [
					"foo.css"
				]
			}
		}
	};
	const output: Config = {
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

test("MergeConfigs(RawConfig[]):RawConfig identifies error source when MergeBundle(Bundle,Bundle) fails", t => {
	const input1: Config = {
		bundle: {
			testBundle: {
				scripts: [
					"foo.js"
				]
			}
		}
	};
	const input2: Config = {
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

test("MergeBundle(Bundle,Bundle):Bundle with empty objects", t => {
	const existingBundle: Bundle = {

	};
	const nextBundle: Bundle = {

	};
	const output: Bundle = {

	};
	t.deepEqual(MergeBundle(existingBundle, nextBundle), output);
});

test("MergeBundle(Bundle,Bundle):Bundle with no collision rules set", t => {
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

test("MergeBundle(Bundle,Bundle):Bundle with merge collision rules set", t => {
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

test("MergeBundle(Bundle,Bundle):Bundle with merge collision rules set and arrays with common items", t => {
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

test("MergeBundle(Bundle,Bundle):Bundle with ignore collision rules set (1)", t => {
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

test("MergeBundle(Bundle,Bundle):Bundle with ignore collision rules set (2)", t => {
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

test("MergeBundle(Bundle,Bundle):Bundle with error collision rules set", t => {
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

/**
 * ValidateRawConfig(RawConfig):void
 */

test("ValidateRawConfig(RawConfig):void with empty object", t => {
	t.notThrows(() => ValidateRawConfig({}
		));
});

test("ValidateRawConfig(RawConfig):void with empty object bundle key", t => {
	const input: any = {
		bundle: {}
	}
	t.notThrows(() => ValidateRawConfig(input
		));
});

test("ValidateRawConfig(RawConfig):void with invalid bundle key", t => {
	const input: any = {
		bundle: "a string"
	}
	t.throws(() => ValidateRawConfig(input
		), `Property "bundle" must be an object and not null.`);
});

test("ValidateRawConfig(RawConfig):void with valid virtual path rules", t => {
	const input: Config = {
		VirtualPathRules: [
			["test", "testtest"]
		]
	}
	t.notThrows(() => ValidateRawConfig(input
		));
});

test("ValidateRawConfig(RawConfig):void with invalid empty matcher virtual path rules", t => {
	const input: Config = {
		VirtualPathRules: [
			["", "testtest"]
		]
	}
	t.throws(() => ValidateRawConfig(input
		), `Value matcher of property "VirtualPathRules" is empty.`);
});

test("ValidateRawConfig(RawConfig):void with invalid empty replacement virtual path rules", t => {
	const input: Config = {
		VirtualPathRules: [
			["test", ""]
		]
	}
	t.throws(() => ValidateRawConfig(input
		), `Value replacement of property "VirtualPathRules" is empty.`);
});

/**
 * ValidateBundle(Bundle,string):void
 */

// Param 1 Base

test("ValidateBundle(Bundle,string):void with empty object", t => {
	t.notThrows(() => ValidateBundle({}, "test"
	));
});

test("ValidateBundle(Bundle,string):void with non-object first paramater", t => {
	const input1: any = "a string";
	t.throws(() => ValidateBundle(input1, "test"
	), "Property bundle>test must be an object and not null.");
});

// Param 2

test("ValidateBundle(Bundle,string):void with non-string second paramater", t => {
	const input2: any = 22;
	t.throws(() => ValidateBundle({}, input2
		), "Bundle name must be a string.");
});

// Param 1 Scripts

test("ValidateBundle(Bundle,string):void with non-array for scripts", t => {
	const input1: any = {
		scripts: "a string"
	};
	t.throws(() => ValidateBundle(input1, "test"
	), "Property bundle>test>scripts must be an array.");
});

test("ValidateBundle(Bundle,string):void with array containing non-strings for scripts", t => {
	const input1: any = {
		scripts: [
			"foo.js",
			() => "magic.js",
			22
		]
	};
	t.throws(() => ValidateBundle(input1, "test"
	), "All indexes of bundle>test>scripts must be a string.");
});

test("ValidateBundle(Bundle,string):void with valid array for scripts", t => {
	const input1: Bundle = {
		scripts: [
			"foo.js",
			"bar.js"
		]
	};
	t.notThrows(() => ValidateBundle(input1, "test"
	));
});

// Param 1 scripts

test("ValidateBundle(Bundle,string):void with non-array for styles", t => {
	const input1: any = {
		styles: "a string"
	};
	t.throws(() => ValidateBundle(input1, "test"
	), "Property bundle>test>styles must be an array.");
});

test("ValidateBundle(Bundle,string):void with array containing non-strings for styles", t => {
	const input1: any = {
		styles: [
			"foo.css",
			() => "magic.css",
			22
		]
	};
	t.throws(() => ValidateBundle(input1, "test"
	), "All indexes of bundle>test>styles must be a string.");
});

test("ValidateBundle(Bundle,string):void with valid array for styles", t => {
	const input1: Bundle = {
		styles: [
			"foo.css",
			"bar.css"
		]
	};
	t.notThrows(() => ValidateBundle(input1, "test"
	));
});

// Param 1 Options

test("ValidateBundle(Bundle,string):void with non-object for options", t => {
	const input1: any = {
		options: 22
	};
	t.throws(() => ValidateBundle(input1, "test"
	), "Property bundle>test>options must be an object and not null.");
});

test("ValidateBundle(Bundle,string):void with non-object for options>sprinkle", t => {
	const input1: any = {
		options: {
			sprinkle: 22
		}
	};
	t.throws(() => ValidateBundle(input1, "test"
	), "Property bundle>test>options>sprinkle must be an object and not null.");
});

test("ValidateBundle(Bundle,string):void ensures onCollision option is valid", t => {
	// replace
	const input1: Bundle = {
		options: {
			sprinkle: {
				onCollision: "replace"
			}
		}
	};
	t.notThrows(() => ValidateBundle(input1, "test"
	));
	// merge
	input1.options.sprinkle.onCollision = "merge";
	t.notThrows(() => ValidateBundle(input1, "test"
	));
	// error
	input1.options.sprinkle.onCollision = "error";
	t.notThrows(() => ValidateBundle(input1, "test"
	));
	// ignore
	input1.options.sprinkle.onCollision = "ignore";
	t.notThrows(() => ValidateBundle(input1, "test"
	));

	// Bad
	input1.options.sprinkle.onCollision = "an invalid collision reaction";
	t.throws(() => ValidateBundle(input1, "test"
	), "Property bundle>test>options>sprinkle>onCollision must be a valid rule.");
});
