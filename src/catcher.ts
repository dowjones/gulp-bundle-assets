import { Transform, TransformCallback } from "stream";

/**
 * All this does is collect all stream data and once all read resolves a promise with the collected chunks.
 * TODO Handle when the stream source has no chunks to pass
 */
export class Catcher extends Transform {
    /**
     * Promise that will be resolved with the stream contents once they've been collected.
     */
    public Collected: Promise<any[]>;

    /**
     * Holds caught stream content.
     */
    private Results: any[] = [];

    /**
     * Resolver for promise, may not be immeditately set.
     */
    private Resolve?: (value?: any[] | PromiseLike<any[]>) => void;
    
    constructor() {
        super({
            objectMode: true
        });

        // Set promise
        this.Collected = new Promise<any[]>(resolve => {
            this.Resolve = resolve;
        });
    }

    /**
     * Collects incoming chunks.
     * @param chunk Incoming chunk to catch.
     * @param encoding Its encoding, if applicable.
     * @param callback Callback used to indicate method completion.
     */
    _transform(chunk: any, encoding: string, callback: TransformCallback): void {
        this.Results.push(chunk);
        callback();
    }

    /**
     * Resolves collection promise.
     * @param callback Callback used to indicate method completion.
     */
    _flush(callback: TransformCallback): void {
        const resolver = () => {
            if (this.Resolve) {
                this.Resolve(this.Results);
                callback();
            }
            else {
                setTimeout(resolver, 5);
            }
        };
        resolver();
    }
}