import * as AnsiColors from "ansi-colors";
import * as PluginError from "plugin-error";
import * as Stream from "stream";
import * as Through2 from "through2";
import * as Vinyl from "vinyl";
import Config from "./config";
import PluginDetails from "./plugin-details";

export default (options: object = {}): Stream.Transform => {
    // Process configuration
    const config = new Config(options);

    // Prepare

    // Generate bundles
    return Through2.obj(function transformer(chunk, enc, cb) {
        try {
            // Make sure is Vinyl instance
            if (!Vinyl.isVinyl(chunk)) {
                throw new Error("Encountered unsupported chunk in stream. Only instances of Vinyl are supported.");
            }

            // Grab required data

            // Process chunk as required.
            if (chunk.isBuffer()) {
                // Soon TM
                throw new Error("Buffers aren't yet supported.");
            } else if (chunk.isStream()) {
                // Streams are poorly supported in the ecosystem, and appear to have implementation
                // bugs within Vinyl as a result. It simply isn't worth the effort to support them.
                // We error out to prevent silent failures.
                throw new Error("Streams aren't supported.");
            } else {
                // Chunk is either null, or something... else. Just pass it on.
                return cb(null, chunk);
            }

            config.get();
            return cb(null, chunk);
        } catch (err) {
            this.emit("error", new PluginError(PluginDetails.name, err));
        }
    });
};
