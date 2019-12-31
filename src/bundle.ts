import { Readable, Stream } from "stream";
import Vinyl from "vinyl";
import { Logger } from "ts-log";
import intoStream from "into-stream";
import getStream from "get-stream";

/**
 * A function that returns a stream that will be used to bundle assets.
 * @public
 */
export interface BundleStreamFactory {
    /**
     * @param src - Source stream.
     * @param name - Name of bundle.
     */
    (src: Readable, name: string): Stream;
}

/**
 * Represents a bundle to be bundled, assists in process.
 */
export class Bundle {
    public readonly name: string;
    private readonly initialPaths: readonly string[];
    private remainingPaths: string[];
    private readonly files: Map<string, Vinyl> = new Map();
    private readonly streamFactory: BundleStreamFactory;
    private readonly logger: Logger;

    /**
     * @param name Name of bundle, passed to bundle stream factory.
     * @param paths Paths of files this bundle consists of.
     * @param streamFactory The bundle stream factory.
     */
    constructor(
        name: string,
        paths: string[],
        streamFactory: BundleStreamFactory,
        logger: Logger
    ) {
        this.name = name;
        this.initialPaths = paths.slice(0);
        this.remainingPaths = paths.slice(0);
        this.streamFactory = streamFactory;
        this.logger = logger;
        this.logger.trace(
            "Bundle tracker created",
            {
                bundleName: this.name,
                files: this.initialPaths,
            }
        );
    }

    /**
     * Takes a file and returns a Vinyl instance or false depending on if requirements have been met.
     * Unused files are ignored.
     * @param file Vinyl instance of a file that bundle may need.
     */
    public async feed(file: Vinyl): Promise<false|Vinyl[]> {
        const i = this.remainingPaths.indexOf(file.path);
        if (i !== -1) {
            // Remove index
            this.remainingPaths.splice(i, 1);

            // Retain file
            this.files.set(file.path, file.clone());
            this.logger.trace(
                "Retaining file for later bundling",
                {
                    path: file.path,
                    bundleName: this.name,
                }
            );
        }
        else {
            this.logger.trace(
                "Ignoring unused file",
                {
                    path: file.path,
                    bundleName: this.name,
                }
            );
        }

        if (this.remainingPaths.length === 0) {
            const orderedFiles: Vinyl[] = [];
            for (const path of this.initialPaths) {
                orderedFiles.push(this.files.get(path));
            }

            // Perform bundling, and collect results
            this.logger.trace(
                "Creating bundle stream",
                {
                    files: this.initialPaths,
                    bundleName: this.name,
                }
            );
            const chunks = await getStream.array(
                this.streamFactory(
                    intoStream.object(orderedFiles),
                    this.name
                )
            );

            // Verify results are all Vinyl instances
            for (const chunk of chunks) {
                if (!Vinyl.isVinyl(chunk)) {
                    this.logger.error(
                        "Chunk returned by bundle stream is not a Vinyl instance",
                        {
                            bundleName: this.name,
                            chunk,
                        }
                    );
                    throw new Error(`Non-Vinyl chunk returned bu bundle stream for bundle '${this.name}'`);
                }
            }

            return chunks as Vinyl[];
        }
        else {
            return false;
        }
    }
}
