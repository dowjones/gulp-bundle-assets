import test from "ava";
import { MergeRawConfigs, RawConfig } from "./raw-config";

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

// TODO There should be fewer test cases for MergeConfigs and more for MergeBundle to improve coverage (plus reduce verbosity)

test("MergeConfigs(RawConfig[]) with multiple objects and no collision options set", t => {
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

test("MergeConfigs(RawConfig[]) with multiple objects and merge collision rules used", t => {
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
						onCollision: "merge"
					}
				}
			}
		}
	};
	const input3: RawConfig = {
		bundle: {
			testBundle: {
				styles: [
					"foo.css"
				],
				options: {
					sprinkle: {
						onCollision: "merge"
					}
				}
			}
		}
	};
	const output: RawConfig = {
		bundle: {
			testBundle: {
				scripts: [
					"bar.js",
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
			}
		}
	};

	t.deepEqual(MergeRawConfigs([input1, input2, input3]), output);
});

test("MergeConfigs(RawConfig[]) with multiple objects, merge collision rules used, and arrays containing multiple items", t => {
	const input1: RawConfig = {
		bundle: {
			testBundle: {
				scripts: [
					"foo.js",
					"zeta.js",
					"apple.js"
				]
			}
		}
	};
	const input2: RawConfig = {
		bundle: {
			testBundle: {
				scripts: [
					"foo.js",
					"bar.js",
					"aeiou.js"
				],
				options: {
					sprinkle: {
						onCollision: "merge"
					}
				}
			}
		}
	};
	const input3: RawConfig = {
		bundle: {
			testBundle: {
				styles: [
					"foo.css",
					"bar.css"
				],
				options: {
					sprinkle: {
						onCollision: "merge"
					}
				}
			}
		}
	};
	const output: RawConfig = {
		bundle: {
			testBundle: {
				scripts: [
					"foo.js",
					"bar.js",
					"aeiou.js",
					"foo.js",
					"zeta.js",
					"apple.js"
				],
				styles: [
					"foo.css",
					"bar.css"
				],
				options: {
					sprinkle: {
						onCollision: "merge"
					}
				}
			}
		}
	};

	t.deepEqual(MergeRawConfigs([input1, input2, input3]), output);
});

test("MergeConfigs(RawConfig[]) with multiple objects and ignore collision rules used", t => {
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
						onCollision: "ignore"
					}
				}
			}
		}
	};
	const input3: RawConfig = {
		bundle: {
			testBundle: {
				styles: [
					"foo.css"
				],
				options: {
					sprinkle: {
						onCollision: "ignore"
					}
				}
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

	t.deepEqual(MergeRawConfigs([input1, input2, input3]), output);
});

test("MergeConfigs(RawConfig[]) with multiple objects and replace collision rules used", t => {
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
						onCollision: "replace"
					}
				}
			}
		}
	};
	const input3: RawConfig = {
		bundle: {
			testBundle: {
				styles: [
					"foo.css"
				],
				options: {
					sprinkle: {
						onCollision: "replace"
					}
				}
			}
		}
	};
	const output: RawConfig = {
		bundle: {
			testBundle: {
				styles: [
					"foo.css"
				],
				options: {
					sprinkle: {
						onCollision: "replace"
					}
				}
			}
		}
	};

	t.deepEqual(MergeRawConfigs([input1, input2, input3]), output);
});

test("MergeConfigs(RawConfig[]) with multiple objects and error collision rules used", t => {
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
						onCollision: "error"
					}
				}
			}
		}
	};
	const input3: RawConfig = {
		bundle: {
			testBundle: {
				styles: [
					"foo.css"
				],
				options: {
					sprinkle: {
						onCollision: "error"
					}
				}
			}
		}
	};

	t.throws(() => MergeRawConfigs([input1, input2, input3]), "Exception raised while merging bundle 'testBundle' in the raw configuration at index '1'.\nError: The bundle has been previously defined, and the bundle's 'onCollision' property is set to 'error'.");
});

test("MergeConfigs(RawConfig[]) with multiple objects and an invalid collision rules used", t => {
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
	const input3: RawConfig = {
		bundle: {
			testBundle: {
				styles: [
					"foo.css"
				],
				options: {
					sprinkle: {
						onCollision: "badCollisionHandler"
					}
				}
			}
		}
	};

	t.throws(() => MergeRawConfigs([input1, input2, input3]), "Exception raised while merging bundle 'testBundle' in the raw configuration at index '1'.\nError: Unexpected input 'badCollisionHandler' for 'onCollision' option of next bundle.");
});
