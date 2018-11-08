import test from "ava";
import { MergeConfigs } from "./main";

test("MergeConfigs(RawConfig[]) with single empty object", t => {
	t.deepEqual(MergeConfigs([{}]), {});
});

test("MergeConfigs(RawConfig[]) with multiple empty objects", t => {
	t.deepEqual(MergeConfigs([{}, {}, {}]), {});
});

test("MergeConfigs(RawConfig[]) with single object", t => {
	const input1 = {
		bundle: {
			testBundle: {
				scripts: [
					"foo.js"
				]
			}
		}
	};
	const output = {
		bundle: {
			testBundle: {
				scripts: [
					"foo.js"
				]
			}
		}
	};

	t.deepEqual(MergeConfigs([input1]), output);
});

test("MergeConfigs(RawConfig[]) with multiple objects and no collision options set", t => {
	const input1 = {
		bundle: {
			testBundle: {
				scripts: [
					"foo.js"
				]
			}
		}
	};
	const input2 = {
		bundle: {
			testBundle: {
				scripts: [
					"bar.js"
				]
			}
		}
	};
	const input3 = {
		bundle: {
			testBundle: {
				styles: [
					"foo.css"
				]
			}
		}
	};
	const output = {
		bundle: {
			testBundle: {
				styles: [
					"foo.css"
				]
			}
		}
	};

	t.deepEqual(MergeConfigs([input1, input2, input3]), output);
});
