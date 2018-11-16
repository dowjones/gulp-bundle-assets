import Vinyl, { isVinyl } from "vinyl";
import { Catcher } from "./catcher";
import { BundlerStreamFactory, VinylExtension } from "./main";

/**
 * 
 * @param files Map of files and virtual paths to take bundle resources from.
 * @param bundles Bundles to build.
 * @param bundleStreamFactory Source of streams used to generate bundles.
 */
export async function BundlesProcessor(
    files: Map<string, (Vinyl & VinylExtension)>,
    bundles: Map<string, string[]>,
    bundleStreamFactory: BundlerStreamFactory
): Promise<[any[], Map<string, string[]>]> {
    // Track results
    const resultPaths: Map<string, string[]> = new Map();
    const resultChunks = [];

    // Process each bundle
    for (const [name, paths] of bundles) {
        // Create bundle stream
        const stream = bundleStreamFactory(name);

        // Push in content
        for (const path of paths) {
            if (files.has(path)) stream.push(files.get(path).clone());
            else throw new Error(`No file was resovled for ${path} of bundle ${name}.`);
        }

        // Catch results
        const catcher = new Catcher();
        stream.pipe(catcher);
        const chunks = await catcher.Collected;

        // Add to resultPaths and resultChunks
        const chunkPaths: string[] = [];
        for (const chunk of chunks) {
            // Track the path if chunk is a valid Vinyl object
            if (isVinyl(chunk) && chunk.path) {
                chunkPaths.push(chunk.path);
            }

            // Store the chunk
            resultChunks.push(chunk);
        }

        // Store the chunkPaths
        resultPaths.set(name, chunkPaths)
    }

    return [resultChunks, resultPaths];
}