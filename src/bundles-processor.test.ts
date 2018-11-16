import { BundlesProcessor } from "./bundles-processor";
import { test } from "ava";
import Vinyl from "vinyl";
import { VinylExtension, BundlerStreamFactory } from "./main";
import { Transform } from "stream";

test("BundlesProcessor(Map<string, (Vinyl & VinylExtension)>, Map<string, string[]>, BundlerStreamFactory): Promise<[any[], Map<string, string[]>]> with iterable inputs empty", async t => {
    const files: Map<string, (Vinyl & VinylExtension)> = new Map();
    const bundles: Map<string, string[]> = new Map();
    const bundleStreamFactory: BundlerStreamFactory = (name: string): Transform => {
        return new Transform({ objectMode: true });
    };

    t.deepEqual([[], new Map()], await BundlesProcessor(files, bundles, bundleStreamFactory));
});

test("BundlesProcessor(Map<string, (Vinyl & VinylExtension)>, Map<string, string[]>, BundlerStreamFactory): Promise<[any[], Map<string, string[]>]> with files but no bundles", async t => {
    const files: Map<string, (Vinyl & VinylExtension)> = new Map();
    files.set("test", Object.assign(
        new Vinyl({
            contents: Buffer.from("test")
        }), {
            Precedence: 1
        } as VinylExtension));
    const bundles: Map<string, string[]> = new Map();
    const bundleStreamFactory: BundlerStreamFactory = (name: string): Transform => {
        return new Transform({ objectMode: true });
    };

    t.deepEqual([[], new Map()], await BundlesProcessor(files, bundles, bundleStreamFactory));
});

test("BundlesProcessor(Map<string, (Vinyl & VinylExtension)>, Map<string, string[]>, BundlerStreamFactory): Promise<[any[], Map<string, string[]>]> with files and bundles", async t => {
    const files: Map<string, (Vinyl & VinylExtension)> = new Map();
    files.set("test", Object.assign(
        new Vinyl({
            contents: Buffer.from("test"),
            path: "test"
        }), {
            Precedence: 1
        } as VinylExtension));
    const bundles: Map<string, string[]> = new Map();
    bundles.set("test", ["test"]);
    const bundleStreamFactory: BundlerStreamFactory = (name: string): Transform => {
        return new Transform({ objectMode: true });
    };
    
    const resultChunks: any[] = [
        Object.assign(
            new Vinyl({
                contents: Buffer.from("test"),
                path: "test"
            }), {
                Precedence: 1
            } as VinylExtension)
    ];
    const resultPaths: Map<string, string[]> = new Map();
    resultPaths.set("test", ["test"]);

    t.deepEqual([resultChunks, resultPaths], await BundlesProcessor(files, bundles, bundleStreamFactory));
});
