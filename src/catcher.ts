import { Transform, TransformCallback } from "stream";

/**
 * All this does is collect all stream data and once all read resolves a promise with the collected chunks.
 */
export class Catcher extends Transform {
    /**
     * Promise that will be resolved with the stream contents once they've been collected.
     */
    public Collected: Promise<any[]>;

    /**
     * A reference to the resolve callback of this.Collected.
     */
    private Resolve?: (value?: any[] | PromiseLike<any[]>) => void;

    /**
     * Holds caught stream content.
     */
    private Results: any[] = [];
    
    constructor() {
        super({
            objectMode: true
        });
        
        this.Collected = new Promise<any[]>((resolve) => {
            this.Resolve = resolve;
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
        if (this.Resolve) this.Resolve(this.Results);

        callback();
    }
}