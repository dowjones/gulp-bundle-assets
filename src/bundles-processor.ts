import Vinyl, { isVinyl } from "vinyl";
import { Catcher } from "./catcher";
import { BundlerStreamFactory } from "./main";
import { Readable } from "stream";
import { LogLevel } from "./log-levels";

/**
 * Processes provided bundle definitions.
 * @param files Map of files and virtual paths to take bundle resources from.
 * @param bundles Definition of bundles to build.
 * @param bundleStreamFactory Source of streams used to generate bundles.
 */
export async function BundlesProcessor(
    files: Map<string, [Vinyl, number]>,
    bundles: Map<string, string[]>,
    bundleStreamFactory: BundlerStreamFactory,
    logger: (value: string, level: LogLevel) => void
): Promise<[any[], Map<string, Vinyl[]>]> {
    const Logger = (msg: string, lvl: LogLevel) => logger(`BundlesProcessor > ${msg}`, lvl);

    try {
        // Track results
        const resultFileInfo: Map<string, Vinyl[]> = new Map();
        const resultChunks = [];

        // Process each bundle
        for (const [name, paths] of bundles) {
            Logger(`Building bundle "${name}"`, LogLevel.Normal);

            // Build bundler with source and bundle name
            Logger("Invoking provided bundler", LogLevel.Silly);

            // Wrap to permit catching and reporting of errors
            const chunks = await new Promise<any[]>(async (resolve, reject) => {
                try {
                    // Create catcher
                    const catcher = new Catcher(Logger);

                    // Create bundle source (and handle errors)
                    const source = new BundleSource(files, paths, Logger)
                        .on("error", (e) => {
                            // Bundle stream will be unpiped automatically
                            Logger("Error emitted by bundle source", LogLevel.Scream);
                            reject(e);
                        });

                    // Run provided transform stream factory
                    bundleStreamFactory(source, name)
                        .on("error", (e) => {
                            // Catcher will be unpiped automatically.
                            Logger("Error emitted by provided joiner", LogLevel.Scream);
                            reject(e);
                        })
                        .pipe(catcher);

                    // Resolve on catcher completion
                    resolve(await catcher.Collected);
                }
                catch (e) {
                    reject(e);
                }
            });

            // Catch results
            Logger("Catching outputs", LogLevel.Silly);

            // Add to resultPaths and resultChunks
            const resultFiles: Vinyl[] = [];
            for (const chunk of chunks) {
                // Copy and track a null file version of each vinyl file
                if (isVinyl(chunk) && chunk.path) {
                    const resultFile = chunk.clone();
                    resultFile.contents = null;
                    resultFiles.push(resultFile);
                }
                else Logger("Non-Vinyl or Vinyl without path chunk was recieved from bundle factory. Information was not captured.", LogLevel.Complain);

                // Store the chunk
                resultChunks.push(chunk);
            }

            // Store the chunkPaths
            resultFileInfo.set(name, resultFiles)
        }

        Logger("Returning bundling results", LogLevel.Silly);
        return [resultChunks, resultFileInfo];
    }
    catch (error) {
        Logger("BundlesProcessor completed with error", LogLevel.Scream);
        throw error;
    }
}

/**
 * Data source for bundler.
 */
class BundleSource extends Readable {
    /**
     * Paths yet to be processed.
     */
    private readonly paths: string[];

    /**
     * Map to pull fully resolved files from.
     */
    private readonly files: Map<string, [Vinyl, number]>;

    private readonly Logger: (value: string, level: LogLevel) => void;

    /**
     * @param files File map to retrieve files from.
     * @param paths Paths to use as keys in file map.
     */
    constructor(files: Map<string, [Vinyl, number]>, paths: string[], logger: (value: string, level: LogLevel) => void) {
        super({
            objectMode: true
        });

        this.files = files;

        // Copy array to we can reduce it as we go
        this.paths = paths.slice(0);

        // Prevent Catcher from becoming stuck when nothing will be coming through
        if (this.paths.length === 0) this.resume();

        this.Logger = (msg, lvl) => logger(`BundleSource > ${msg}`, lvl);
    }

    /**
     * Reads in the next file if there is one.
     */
    _read() {
        if (this.paths.length > 0) {
            const path = this.paths.shift();
            this.Logger(`Locating "${path}"...`, LogLevel.Silly);
            if (this.files.has(path)) {
                const file = this.files.get(path)[0].clone();
                this.Logger(`Found, pushing "${file.path}" on through.`, LogLevel.Silly);
                this.push(file);
            }
            else {
                this.Logger(`Couldn't find "${path}"!`, LogLevel.Silly);
                this.emit("error", new Error(`No file could be resolved for "${path}".`));
            }
        }
        else {
            this.Logger("Nothing left to send", LogLevel.Silly);
            this.push(null);
        }
    }
}
