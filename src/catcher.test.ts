import test from "ava";
import { Catcher } from "./catcher";
import { Readable } from "stream"

test("Catcher catches all stream content", async t => {
    const streamItems = [{}, "test", 21];
    const stream = new Readable({
        objectMode: true,
        read() {
            for (const item of streamItems) {
                this.push(item);
            }
            this.push(null);
        }
    });
    const catcher = new Catcher();
    stream.pipe(catcher);

    t.deepEqual(streamItems, await catcher.Collected);
});
