import test from "ava";
import Bundler, { Bundlers } from "./main";
import { RawConfig } from "./raw-config";
import { Transform, Readable } from "stream";
import { Catcher } from "./catcher";

test("Bundler basic scenario", async t => {
    const config: RawConfig = {

    };
    const joiner: Bundlers = {
        Scripts: () => {
            return new Transform({
                objectMode: true
            });
        },
        Styles: () => {
            return new Transform({
                objectMode: true
            });
        }
    }

    // Results
    const assetMapResult: Map<string, string[]> = new Map();
    const streamResult: any[] = [
        {},
        "test",
        21
    ];

    // Stream source
    const stream = new Readable({
        objectMode: true,
        read: function() {
            for (const chunk of streamResult) {
                this.push(chunk);
            }
            this.push(null);
        }
    });

    // Build results map callback test
    t.plan(2);
    const bundleResultsMapTest = (results: Map<string, string[]>) => {
        t.deepEqual(assetMapResult, results);
    };

    // Run stream
    const bundler = new Bundler(config, joiner, bundleResultsMapTest);
    const catcher = new Catcher();
    stream
        .pipe(bundler)
        .pipe(catcher);

    // Check stream outputs (order is unimportant)
    t.deepEqual(streamResult.sort(), (await catcher.Collected).sort());
});
