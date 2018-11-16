import { Transform, TransformCallback } from "stream";
import LazyPromise from "p-lazy";

/**
 * All this does is collect all stream data and once all read resolves a promise with the collected chunks.
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
    
    constructor() {
        super({
            objectMode: true
        });

        this.Collected = new LazyPromise<any[]>(resolve => {
            resolve(this.Results);
        });
    }

    /**
     * 
     * @param chunk 
     * @param encoding 
     * @param callback 
     */
    _transform(chunk: any, encoding: string, callback: TransformCallback): void {
        this.Results.push(chunk);
        callback();
    }

    /**
     * 
     * @param callback 
     */
    _flush(callback: TransformCallback): void {
        // Probe lazy-promise to trigger call chain
        this.Collected.then(() => callback());
    }
}