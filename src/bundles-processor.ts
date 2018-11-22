import Vinyl, { isVinyl } from "vinyl";
import { Catcher } from "./catcher";
import { BundlerStreamFactory } from "./main";
import { Readable } from "stream";

/**
 * Processes provided bundle definitions.
 * @param files Map of files and virtual paths to take bundle resources from.
 * @param bundles Definition of bundles to build.
 * @param bundleStreamFactory Source of streams used to generate bundles.
 */
export async function BundlesProcessor(
    files: Map<string, [Vinyl, number]>,
    bundles: Map<string, string[]>,
    bundleStreamFactory: BundlerStreamFactory
): Promise<[any[], Map<string, Vinyl[]>]> {
    // Track results
    const resultFileInfo: Map<string, Vinyl[]> = new Map();
    const resultChunks = [];

    // Process each bundle
    for (const [name, paths] of bundles) {
        // Create catcher
        const catcher = new Catcher();

        // Build bundler with source and bundle name
        bundleStreamFactory(new BundleSource(files, paths), name)
            .pipe(catcher);

        // Catch results
        const chunks = await catcher.Collected;

        // Add to resultPaths and resultChunks
        const resultFiles: Vinyl[] = [];
        for (const chunk of chunks) {
            // Track the path if chunk is a valid Vinyl object
            // Copy and track a null file version of each vinyl file
            if (isVinyl(chunk) && chunk.path) {
                const resultFile = chunk.clone();
                resultFile.contents = null;
                resultFiles.push(resultFile);
            }

            // Store the chunk
            resultChunks.push(chunk);
        }

        // Store the chunkPaths
        resultFileInfo.set(name, resultFiles)
    }

    return [resultChunks, resultFileInfo];
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

    /**
     * @param files File map to retrieve files from.
     * @param paths Paths to use as keys in file map.
     */
    constructor(files: Map<string, [Vinyl, number]>, paths: string[]) {
        super({
            objectMode: true
        });

        this.files = files;

        // Copy array to we can reduce it as we go
        this.paths = paths.slice(0);
    }

    /**
     * Reads in the next file if there is one.
     */
    _read() {
        if (this.paths.length > 0) {
            const path = this.paths.pop();
            if (this.files.has(path)) this.push(this.files.get(path)[0].clone());
            else new Error(`No file could be resolved for ${path}.`);
        }
        else this.push(null);
    }
}
