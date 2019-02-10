import test, { ExecutionContext } from "ava";
import Bundler, { Bundlers } from "./main";
import { Readable, Stream } from "stream";
import { Catcher } from "./catcher";
import Vinyl from "vinyl";
import { Config } from "./config/config";
import { SimplePluginError } from "plugin-error";
import { resolve as resolvePath } from "path";
import { stringify } from "querystring";

/**
 * Generic joiner to use for mocking the bundling of resources.
 */
const Joiner: Bundlers = {
    Scripts: stream => stream,
    Styles: stream => stream
};

/**
 * Should complete without throwing, return all files from input stream, and have an empty map returned to the callback.
 */
test("Bundler basic success scenario", async t => {
    // Create bundler args
    const args: BundlerArgs = {
        Config: {},
        Joiner,
        BundleResultsCb: results => t.deepEqual(results, new Map())
    };

    // Define inputs
    const streamInputs = [
        {},
        "test",
        21
    ];

    // Define expected outputs
    const expected = [
        {},
        "test",
        21
    ];

    // Test
    await testBundlerResults(t, args, streamInputs, expected);
});

/**
 * Should complete without throwing, return all files from input stream, and have Vinyl null file objects sent to results callback.
 */
test("Bundler complex success scenario 1", async t => {
    // Create bundler args
    const args: BundlerArgs = {
        Config: {
            bundle: {
                test: {
                    styles: [
                        "test.css"
                    ],
                    scripts: [
                        "test.js"
                    ]
                }
            },
            Logger: () => {}
        },
        Joiner,
        BundleResultsCb: results => testBundlerResultsCallbackData(t, results, new Map<string, Vinyl[]>([ ['test', [new Vinyl( {path: resolvePath("test.css")}), new Vinyl( {path: resolvePath("test.js")})]]]))
    };

    // Define inputs
    const streamInputs = [
        new Vinyl({
            path: resolvePath("test.css"),
            contents: Buffer.from(".test { color: #121435; }")
        }),
        new Vinyl({
            path: resolvePath("test.js"),
            contents: Buffer.from("const the = 'thing';")
        })
    ];

    // Define expected outputs
    const expected = [
        new Vinyl({
            path: resolvePath("test.css"),
            contents: Buffer.from(".test { color: #121435; }")
        }),
        // Returned by joiner
        new Vinyl({
            path: resolvePath("test.css"),
            contents: Buffer.from(".test { color: #121435; }")
        }),
        new Vinyl({
            path: resolvePath("test.js"),
            contents: Buffer.from("const the = 'thing';")
        }),
        // Returned by joiner
        new Vinyl({
            path: resolvePath("test.js"),
            contents: Buffer.from("const the = 'thing';")
        })
    ];

    // Test
    await testBundlerResults(t, args, streamInputs, expected);
});

/**
 * Should complete without throwing, and return all files from input stream.
 */
test("Bundler complex success scenario 2", async t => {
    // Create bundler args
    const args: BundlerArgs = {
        Config: {
            bundle: {
                test1: {
                    styles: [
                        "magicdir/test.css"
                    ]
                },
                test2: {
                    scripts: [
                        "magicdir/test.js"
                    ]
                }
            },
            VirtualPathRules: [
                ['testdir', 'magicdir'],
                ['tdir', 'magicdir']
            ]
        },
        Joiner
    };

    // Define inputs
    const streamInputs = [
        new Vinyl({
            path: resolvePath("tdir/test.css"),
            contents: Buffer.from(".test { color: #121435; }")
        }),
        // Will end up being ignored
        new Vinyl({
            path: resolvePath("testdir/test.css"),
            contents: Buffer.from(".test { color: #121435; }")
        }),
        // Will end up being ignored
        new Vinyl({
            path: resolvePath("testdir/test.js"),
            contents: Buffer.from("const the = 'thing';")
        }),
        new Vinyl({
            path: resolvePath("tdir/test.js"),
            contents: Buffer.from("const the = 'thing';")
        })
    ];

    // Define expected outputs
    const expected = [
        new Vinyl({
            path: resolvePath("tdir/test.css"),
            contents: Buffer.from(".test { color: #121435; }")
        }),
        // Returned by joiner
        new Vinyl({
            path: resolvePath("tdir/test.css"),
            contents: Buffer.from(".test { color: #121435; }")
        }),
        new Vinyl({
            path: resolvePath("tdir/test.js"),
            contents: Buffer.from("const the = 'thing';")
        }),
        // Returned by joiner
        new Vinyl({
            path: resolvePath("tdir/test.js"),
            contents: Buffer.from("const the = 'thing';")
        })
    ];

    // Test
    await testBundlerResults(t, args, streamInputs, expected);
});

/**
 * Should throw.
 */
test("Bundler basic failure scenario", async t => {
    // Create bundler args
    const args: BundlerArgs = {
        Config: {
            bundle: {
                test: {
                    styles: [
                        "testpath.css",
                        "test.css"
                    ]
                }
            },
        },
        Joiner
    };

    // Define inputs
    const streamInputs = [
        new Vinyl({contents: Buffer.from("test"), path: "testpath.css"})
    ];

    // Test
    t.plan(1);

    try {
        await bundlerExceptionHoist(args, streamInputs)
    }
    catch (e) {
        t.is((e as SimplePluginError).message, `No file could be resolved for "${resolvePath("./testpath.css")}".`);
    }
});

/**
 * Compares virtual files based on their declared path, returning a number that indicates their position.
 * @param a Entity one
 * @param b Entity two
 */
function vinylComparator(a: Vinyl, b: Vinyl): number {
    return a.path.localeCompare(b.path);
}

interface BundlerArgs {
    Config: Config;
    Joiner: Bundlers;
    BundleResultsCb?: (results: Map<string, Vinyl[]>) => void;
}

/**
 * Creates bundler and data source stream.
 * @param args Arguments to be passed to bundler.
 * @param streamContents Objects to be feed into bundler via stream.
 */
function createBundler(args: BundlerArgs, streamContents: any[]): Stream {
    // Create bundler
    const bundler = new Bundler(args.Config, args.Joiner, args.BundleResultsCb);

    // Build source stream
    const stream = new Readable({
        objectMode: true,
        read: function() {
            for (const chunk of streamContents) {
                this.push(chunk);
            }
            this.push(null);
        }
    });

    // Assemble stream and return
    return stream
        .pipe(bundler);
}

/**
 * Helper class that builds bundler and verifies stream output.
 * @param t Execution context used for test.
 * @param args Arguments passed to bundler.
 * @param streamContents Objects to be feed into bundler via stream.
 * @param expected Expected result, order insensitive.
 */
async function testBundlerResults(t: ExecutionContext, args: BundlerArgs, streamContents: any[], expected: any) {
    // Create bundler
    const bundler = createBundler(args, streamContents);

    // Create catcher (so we can see what the results are)
    const catcher = new Catcher(() => {});

    // Run bundler
    bundler
        .pipe(catcher);

    function comparator(a, b): number {
        if (a.path && b.path) {
            return vinylComparator(a, b);
        }
        else {
            if (a < b) return -1;
            if (a > b) return 1;
            return 0;
        }
    }

    // Inspect results
    t.deepEqual((await catcher.Collected).sort(comparator), expected.sort(comparator));
}

function testBundlerResultsCallbackData(t: ExecutionContext, actual: Map<string, Vinyl[]>, expected: Map<string, Vinyl[]>) {
    t.is(actual.size, expected.size);
    actual.forEach((files, bundleName) => {
        t.true(expected.has(bundleName));
        t.deepEqual(files.sort(vinylComparator), expected.get(bundleName).sort(vinylComparator));
    });
}

/**
 * Returns a promise that will hoist bundler exceptions into an accessible scope.
 * @param args Arguments passed to bundler.
 * @param streamContents Objects to be feed into bundler via stream.
 */
function bundlerExceptionHoist(args: BundlerArgs, streamContents: any[]): Promise<undefined> {
    return new Promise<undefined>((resolve, reject) => {
        // Create bundler
        const bundler = createBundler(args, streamContents);

        // Create catcher (so we can detect completion)
        const catcher = new Catcher(() => {});

        // Run bundler
        bundler
            .on("error", (e) => {
                reject(e)
            })
            .pipe(catcher)
            .on("error", (e) => {
                reject(e)
            });

        catcher.Collected.then(() => {
            resolve();
        });
    })
}
