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
