import test from "ava";
import { Bundle } from "./bundle.js";
import { Stream, Readable } from "stream";
import { resolve as resolvePath } from "path";
import Vinyl from "vinyl";
import intoStream from "into-stream";
import { mapAvaLoggerToStandard } from "./test-util.js";

/**
 * Returns stream factory was provided, without modification.
 * @param src Source stream
 */
function bundleFactoryEcho(src: Readable): Stream {
    return src;
}

test("Ignores unused files", async t => {
    const bundle = new Bundle(
        "test",
        "script",
        [
            resolvePath("./test-used-1.js"),
            resolvePath("./test-used-2.js"),
        ],
        bundleFactoryEcho,
        mapAvaLoggerToStandard(t),
    );

    t.is(
        await bundle.feed(new Vinyl({ path: resolvePath("./test-unused-1.js") })),
        false
    );

    t.is(
        await bundle.feed(new Vinyl({ path: resolvePath("./test-used-1.js") })),
        false
    );

    t.is(
        await bundle.feed(new Vinyl({ path: resolvePath("./test-unused-2.js") })),
        false
    );
});

test("Returns a stream once feed sends in the last required file", async t => {
    const bundle = new Bundle(
        "test",
        "script",
        [
            resolvePath("./test-1.js"),
            resolvePath("./test-2.js"),
        ],
        bundleFactoryEcho,
        mapAvaLoggerToStandard(t),
    );

    t.is(
        await bundle.feed(new Vinyl({ path: resolvePath("./test-1.js") })),
        false
    );

    t.deepEqual(
        await bundle.feed(new Vinyl({ path: resolvePath("./test-2.js") })),
        [
            new Vinyl({ path: resolvePath("./test-1.js") }),
            new Vinyl({ path: resolvePath("./test-2.js") }),
        ]
    );
});

test("Multiple non-Vinyl chunks returned by bundle stream", async t => {
    const bundle = new Bundle(
        "test",
        "script",
        [ resolvePath("./test-1.js") ],
        function (): Stream {
            return intoStream.object([ {}, {} ]);
        },
        mapAvaLoggerToStandard(t),
    );

    await t.throwsAsync(
        () => bundle.feed(new Vinyl({ path: resolvePath("./test-1.js") })),
        null,
        "Non-Vinyl chunk returned by bundle stream for bundle 'test'"
    );
});

test("Single non-Vinyl chunks returned by bundle stream", async t => {
    const bundle = new Bundle(
        "test",
        "script",
        [ resolvePath("./test-1.js") ],
        function (): Stream {
            return intoStream.object({});
        },
        mapAvaLoggerToStandard(t),
    );

    await t.throwsAsync(
        () => bundle.feed(new Vinyl({ path: resolvePath("./test-1.js") })),
        null,
        "Non-Vinyl chunk returned by bundle stream for bundle 'test'"
    );
});
