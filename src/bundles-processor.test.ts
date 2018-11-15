import { BundlesProcessor } from "./bundles-processor";
import { test } from "ava";
import * as Vinyl from "vinyl";
import { VinylExtension, BundlerStreamFactory } from "./main";
import { Transform } from "stream";

test("Bundles processor basic test", async t => {
    const files: Map<string, (Vinyl & VinylExtension)> = new Map();
    const bundles: Map<string, string[]> = new Map();
    const bundleStreamFactory: BundlerStreamFactory = (name: string): Transform => {
        return new Transform({objectMode: true});
    };

    BundlesProcessor(files, bundles, bundleStreamFactory);
    
    t.pass();
});
