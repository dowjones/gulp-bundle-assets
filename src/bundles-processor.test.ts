import { BundlesProcessor } from "./bundles-processor";
import { test } from "ava";
import Vinyl from "vinyl";
import { VinylExtension, BundlerStreamFactory } from "./main";
import { Transform, TransformCallback, Readable } from "stream";

test("BundlesProcessor(Map<string, (Vinyl & VinylExtension)>, Map<string, string[]>, BundlerStreamFactory): Promise<[any[], Map<string, string[]>]> with iterable inputs empty", async t => {
    const files: Map<string, (Vinyl & VinylExtension)> = new Map();
    const bundles: Map<string, string[]> = new Map();

    t.deepEqual([[], new Map()], await BundlesProcessor(files, bundles, BundleStreamFactory));
});

test("BundlesProcessor(Map<string, (Vinyl & VinylExtension)>, Map<string, string[]>, BundlerStreamFactory): Promise<[any[], Map<string, string[]>]> with files but no bundles", async t => {
    const files: Map<string, (Vinyl & VinylExtension)> = new Map();
    files.set("test", MakeExtendedVinyl("test", "test"));
    const bundles: Map<string, string[]> = new Map();

    t.deepEqual([[], new Map()], await BundlesProcessor(files, bundles, BundleStreamFactory));
});

test("BundlesProcessor(Map<string, (Vinyl & VinylExtension)>, Map<string, string[]>, BundlerStreamFactory): Promise<[any[], Map<string, string[]>]> with files and bundles", async t => {
    const files: Map<string, (Vinyl & VinylExtension)> = new Map();
    files.set("test", MakeExtendedVinyl("test", "test"));
    const bundles: Map<string, string[]> = new Map();
    bundles.set("test", ["test"]);

    const resultChunks: any[] = [
        MakeExtendedVinyl("test", "test")
    ];
    const resultPaths: Map<string, string[]> = new Map();
    resultPaths.set("test", ["test"]);

    t.deepEqual([resultChunks, resultPaths], await BundlesProcessor(files, bundles, BundleStreamFactory));
});

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
