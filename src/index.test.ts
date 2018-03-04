/// <reference types="jest" />
import * as EventStream from "event-stream";
import * as PluginError from "plugin-error";
import * as Stream from "stream";
import * as Vinyl from "Vinyl";
import index from "./index";

describe("pipe etiquette", () => {
    test("should push unsupported chunks", () => {
        const chunk = new Vinyl({
            contents: null
        });

        const transformer = index();

        transformer.write(chunk);

        transformer.once("data", (file: Vinyl) => {
            expect(file.isNull()).toBeTruthy();
        });
    });
});

test("should support buffer chunks", () => {
    const chunk = new Vinyl({
        contents: new Buffer("qwerty")
    });

    const transformer = index();

    transformer.write(chunk);

    transformer.once("data", (file: Vinyl) => {
        expect(file.isBuffer()).toBeTruthy();
        expect(file.contents.toString()).toBe("qwerty");
    });
});

test("shouldn't support stream chunks", () => {
    const rs = new Stream.Readable();
    rs._read = () => {/*nope*/};
    rs.push("qwerty");
    const chunk = new Vinyl({
        contents: rs
    });

    const transformer = index();

    transformer.once("error", (err) => {
        expect(err.message).toBe("Streams aren't supported.");
    });

    transformer.write(chunk);
});
