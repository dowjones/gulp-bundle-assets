import test, { ExecutionContext } from "ava";
import { BundleOrchastrator } from "./bundle-orchastrator.js";
import intoStream from "into-stream";
import getStream from "get-stream";
import { Readable, Stream } from "stream";
import Vinyl from "vinyl";
import { resolve as resolvePath } from "path";
import sortOn from "sort-on";
import { mapAvaLoggerToStandard } from "./test-util.js";

/**
 * Returns a pretend bundle for testing purposes.
 * @param name Name of bundle.
 */
function bundleFactoryJs(_: Readable, name: string): Stream {
    let first = true;
    const newSrc = new Readable({
        objectMode: true,
        read() {
            if (first) {
                first = false;
                this.push(new Vinyl({ path: resolvePath(name + ".js") }))
            } else {
                this.push(null);
            }
        }
    });

    return newSrc;
}

/**
 * Returns a pretend bundle for testing purposes.
 * @param name Name of bundle.
 */
function bundleFactoryCss(_: Readable, name: string): Stream {
    let first = true;
    const newSrc = new Readable({
        objectMode: true,
        read() {
            if (first) {
                first = false;
                this.push(new Vinyl({ path: resolvePath(name + ".css") }))
            } else {
                this.push(null);
            }
        }
    });

    return newSrc;
}

interface IBundleBuilderFlags {
    /**
     * Explicitly set cwd.
     */
    explicitCwd?: boolean;

    /**
     * Don't include any bundle specs.
     */
    noBundles?: boolean;
}

/**
 * Tool to help build bundler for tests.
 * @param t Execution context from test.
 * @param flags Flags used to modify returned bundler.
 */
function buildBundler(t: ExecutionContext, flags: IBundleBuilderFlags = {}) {
    return new BundleOrchastrator(
        {
            cwd: flags.explicitCwd
                ? process.cwd()
                : undefined,
            Logger: mapAvaLoggerToStandard(t),
            bundle: flags.noBundles
                ? undefined
                : {
                bund1: {
                    scripts: [
                        "./123/bar.js",
                        "./abc/foo.js",
                    ],
                    styles: [
                        "./123/foo.css",
                        "./abc/foo.css",
                    ]
                }
            }
        },
        {
            Scripts: bundleFactoryJs,
            Styles: bundleFactoryCss,
        },
    );
}

test("Bundles with all dependencies met", async t => {
    const result = await getStream.array(
        intoStream.object([
            new Vinyl({ path: resolvePath("./123/bar.js") }),
            new Vinyl({ path: resolvePath("./123/foo.css") }),
            new Vinyl({ path: resolvePath("./abc/foo.css") }),
            new Vinyl({ path: resolvePath("./abc/foo.js") }),
        ])
            .pipe(buildBundler(t))
    ) as Vinyl[];

    t.deepEqual(
        sortOn(result, 'history'),
        sortOn(
            [
                // Original inputs
                new Vinyl({ path: resolvePath("./123/bar.js") }),
                new Vinyl({ path: resolvePath("./123/foo.css") }),
                new Vinyl({ path: resolvePath("./abc/foo.css") }),
                new Vinyl({ path: resolvePath("./abc/foo.js") }),
                // Bundles
                new Vinyl({ path: resolvePath("./bund1.js") }),
                new Vinyl({ path: resolvePath("./bund1.css") }),
            ],
            'history'
        )
    );
});

/**
 * @todo This should be improved to account for _different_ `cwd`s. Currently UserFrosting covers
 * this via its usage of this library.
 */
test("Bundles with all dependencies met and custom cwd", async t => {
    const result = await getStream.array(
        intoStream.object([
            new Vinyl({ path: resolvePath("./123/bar.js") }),
            new Vinyl({ path: resolvePath("./123/foo.css") }),
            new Vinyl({ path: resolvePath("./abc/foo.css") }),
            new Vinyl({ path: resolvePath("./abc/foo.js") }),
        ])
            .pipe(buildBundler(t, { explicitCwd: true }))
    ) as Vinyl[];

    t.deepEqual(
        sortOn(result, 'history'),
        sortOn(
            [
                // Original inputs
                new Vinyl({ path: resolvePath("./123/bar.js") }),
                new Vinyl({ path: resolvePath("./123/foo.css") }),
                new Vinyl({ path: resolvePath("./abc/foo.css") }),
                new Vinyl({ path: resolvePath("./abc/foo.js") }),
                // Bundles
                new Vinyl({ path: resolvePath("./bund1.js") }),
                new Vinyl({ path: resolvePath("./bund1.css") }),
            ],
            'history'
        )
    );
});

test("No bundles to build", async t => {
    const result = await getStream.array(
        intoStream.object([
            new Vinyl({ path: resolvePath("./123/bar.js") }),
            new Vinyl({ path: resolvePath("./123/foo.css") }),
            new Vinyl({ path: resolvePath("./abc/foo.css") }),
            new Vinyl({ path: resolvePath("./abc/foo.js") }),
        ])
            .pipe(buildBundler(t, { noBundles: true }))
    ) as Vinyl[];

    t.deepEqual(
        sortOn(result, 'history'),
        sortOn(
            [
                // Original inputs
                new Vinyl({ path: resolvePath("./123/bar.js") }),
                new Vinyl({ path: resolvePath("./123/foo.css") }),
                new Vinyl({ path: resolvePath("./abc/foo.css") }),
                new Vinyl({ path: resolvePath("./abc/foo.js") }),
            ],
            'history'
        )
    );
});

test("Non-vinyl chunk pushed out when feed in", async t => {
    try {
        const result = await getStream.array(
            intoStream.object([
                new Vinyl({ path: resolvePath("./123/bar.js") }),
                new Vinyl({ path: resolvePath("./123/foo.css") }),
                new Vinyl({ path: resolvePath("./abc/foo.css") }),
                new Vinyl({ path: resolvePath("./abc/foo.js") }),
                "nonsense-input",
            ])
                .pipe(buildBundler(t))
        ) as (Vinyl|string)[];

        t.true(result.includes("nonsense-input"));
    } catch (e) {
        t.log(e);
        t.fail();
    }
});

test("Bundles with unmet dependencies", async t => {
    await t.throwsAsync(
        function () {
            return getStream.array(
                intoStream.object([
                    new Vinyl({ path: resolvePath("./123/bar.js") }),
                    new Vinyl({ path: resolvePath("./123/foo.css") }),
                    new Vinyl({ path: resolvePath("./abc/foo.css") }),
                ])
                    .pipe(buildBundler(t))
            );
        },
        {
            instanceOf: Error,
            message: "Stream completed before all bundles recieved their dependencies",
        }
    );
});

test("Bundles with all dependencies unmet", async t => {
    await t.throwsAsync(
        function () {
            return getStream.array(
                intoStream.object([])
                    .pipe(buildBundler(t))
            );
        },
        {
            instanceOf: Error,
            message: "Stream completed before all bundles recieved their dependencies",
        }
    );
});
