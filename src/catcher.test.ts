import test, { ExecutionContext } from "ava";
import { Catcher } from "./catcher";
import { Readable } from "stream"

test("Catcher catches all stream content", async t => {
    const input = [{}, "test", 21];
    const result = [{}, "test", 21];

    await TestCatcher(t, input, result);
});

test("Catcher when no content is read into the stream", async t => {
    const input = [];
    const result = [];

    await TestCatcher(t, input, result);
});

test("Catcher when there is a lot of content in the stream", async t => {
    const input = [];
    for (let i = 0; i <= 100_000; i++)
        input.push("content " + i);
    const result = [];
    for (let i = 0; i <= 100_000; i++)
        result.push("content " + i);

    await TestCatcher(t, input, result);
});

/**
 * Runs common test logic.
 * @param t Test context from test function callback.
 * @param input Data to feed into stream.
 * @param result Expected output data (sensitive insensitive)
 */
async function TestCatcher(t: ExecutionContext, input: any[], result: any[]): Promise<void> {
    const catcher = new Catcher(() => {});
    new TestSource(input).pipe(catcher);

    t.deepEqual(result.sort(), (await catcher.Collected).sort());
}

/**
 * Test class used as the source stream.
 */
class TestSource extends Readable {
    /**
     * Data yet to be pushed into stream.
     */
    private data: any[];

    /**
     * @param data Data to push into stream.
     */
    constructor(data: any[]) {
        super({
            objectMode: true
        });

        this.data = data;
    }

    _read() {
        if (this.data.length > 0) this.push(this.data.pop());
        else this.push(null);
    }
}
