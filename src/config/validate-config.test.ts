import test from "ava";
import ValidateConfig from "./validate-config";
import { Config } from "./config";
import { resolve as resolvePath } from "path";

/**
 * Should complete without throwing.
 */
test("Empty object", t => {
	t.notThrows(() => ValidateConfig({}));
});

/**
 * Should complete without throwing.
 */
test("Empty object bundle property", t => {
	const config: any = {
		bundle: {
            foo: {}
        }
	}
	t.notThrows(() => ValidateConfig(config));
});

/**
 * Should complete without throwing.
 */
test("Valid bundle property", t => {
	const config: Config = {
		bundle: {}
	}
	t.notThrows(() => ValidateConfig(config));
});

/**
 * Should throw when bundle property is not an object.
 */
test("Non-object bundle property", t => {
	const config: any = {
		bundle: "a string"
	}
	t.throws(
        () => ValidateConfig(config),
        `Property "bundle" must be an object and not null.`
    );
});

/**
 * Should complete without throwing.
 */
test("Valid virtual path rules", t => {
	const config: Config = {
		VirtualPathRules: [
			["test", "testtest"]
		]
	}
	t.notThrows(() => ValidateConfig(config));
});

/**
 * Should throw when an invalid empty matcher is used for virtual path rules.
 */
test("Empty matcher virtual path rules", t => {
	const config: Config = {
		VirtualPathRules: [
			["", "testtest"]
		]
	}
	t.throws(
        () => ValidateConfig(config),
        `Value matcher of property "VirtualPathRules" is empty.`
    );
});

/**
 *Should throw when an invalid empty replacement is used for virtual path rules.
 */
test("Empty replacement virtual path rules", t => {
	const config: Config = {
		VirtualPathRules: [
			["test", ""]
		]
	}
	t.throws(
        () => ValidateConfig(config),
        `Value replacement of property "VirtualPathRules" is empty.`
    );
});

/**
 *Should throw when an invalid empty replacement is used for virtual path rules.
 */
test("Non-array for replacement virtual path rules", t => {
	const config1: any = {
		VirtualPathRules: "not-an-array!"
	}
	t.throws(
        () => ValidateConfig(config1),
        `Property "VirtualPathRules" must be an object and not null.`
    );

    const config2: any = {
		VirtualPathRules: null
	}
	t.throws(
        () => ValidateConfig(config2),
        `Property "VirtualPathRules" must be an object and not null.`
    );
});

/**
 * Should throw when a matcher has a dupliate.
 */
test("Duplicate matcher virtual path rules", t => {
	const config: Config = {
		VirtualPathRules: [
            ["dup", "testtest"],
            ["dup", "test"]
		]
	}
	t.throws(
        () => ValidateConfig(config),
        `Value matcher of property "VirtualPathRules" has a duplicate "dup" which resolves to "${resolvePath("dup")}"`
    );
});
