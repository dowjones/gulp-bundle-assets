import { BundlesProcessor } from "./bundles-processor";
import test, { GenericTestContext, Context } from "ava";
import Vinyl from "vinyl";
import { VinylExtension, BundlerStreamFactory } from "./main";
import { Transform, TransformCallback, Readable } from "stream";

test("BundlesProcessor with iterable inputs empty", async t => {
    const files: Map<string, (Vinyl & VinylExtension)> = new Map();
    const bundles: Map<string, string[]> = new Map();

    TestBundler(t, [[], new Map()], await BundlesProcessor(files, bundles, BundleStreamFactory));
    
});

test("BundlesProcessor with files but no bundles", async t => {
    const files: Map<string, (Vinyl & VinylExtension)> = new Map();
    files.set("test", MakeExtendedVinyl("test", "test"));
    const bundles: Map<string, string[]> = new Map();

    TestBundler(t, [[], new Map()], await BundlesProcessor(files, bundles, BundleStreamFactory));
});

test("BundlesProcessor with files and bundles", async t => {
    const files: Map<string, (Vinyl & VinylExtension)> = new Map();
    files.set("test", MakeExtendedVinyl("test", "test"));
    const bundles: Map<string, string[]> = new Map();
    bundles.set("test", ["test"]);

    const resultChunks: any[] = [
        MakeExtendedVinyl("test", "test")
    ];
    const resultPaths: Map<string, string[]> = new Map();
    resultPaths.set("test", ["test"]);

    TestBundler(t, [resultChunks, resultPaths], await BundlesProcessor(files, bundles, BundleStreamFactory));
});

function TestBundler(t: GenericTestContext<Context<any>>, expected: [any[], Map<string, string[]>], actual: [any[], Map<string, string[]>]): void {
    // Check result chunks (order insensitive)
    t.deepEqual(expected[0].sort(), actual[0].sort());

    // Sort result paths
    expected[1].forEach(paths => paths.sort());
    actual[1].forEach(paths => paths.sort());
    
    // Check result paths
    t.deepEqual(expected[1], actual[1]);
}

/**
 * Simple stub for testing purposes
 */
class TestTransform extends Transform {
    constructor() {
        super({ objectMode: true });

    }

    _transform(chunk: any, encoding: string, callback: TransformCallback): void {
        this.push(chunk);
        callback();
    }
}

/**
 * Makes an extended Vinyl object. For testing purposes.
 * @param contents Contents used to make buffer.
 * @param path Path of file.
 * @param precedence Precedence value. Optional.
 */
function MakeExtendedVinyl(contents: string, path: string, precedence: number = 0): (Vinyl & VinylExtension) {
    return Object.assign(
        new Vinyl({
            contents: Buffer.from(contents),
            path
        }), {
            Precedence: precedence
        }
    );
}

const BundleStreamFactory: BundlerStreamFactory = (src: Readable): Transform => {
    return src.pipe(new TestTransform());
};
