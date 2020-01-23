import test, { ExecutionContext } from "ava";
import { BundleOrchastrator } from "./bundle-orchastrator.js";
import intoStream from "into-stream";
import getStream from "get-stream";
import { Readable, Stream } from "stream";
import Vinyl from "vinyl";
import { resolve as resolvePath } from "path";
import sortOn from "sort-on";

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

function buildBundler(t: ExecutionContext) {
    return new BundleOrchastrator(
        {
            bundle: {
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
