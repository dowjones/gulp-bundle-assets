import { Logger } from "ts-log";

/**
 * Rules for how a bundle collision may be treated.
 */
export enum CollisionReactions {
    /**
     * Replace the existing bundle.
     */
    replace,
    /**
     * Merge with the existing bundle, with order preserved as much as possible.
     * Colliding arrays will be prepended to the existing, keep an eye out for duplicates.
     */
    merge,
    /**
     * Leave the existing bundle alone.
     */
    ignore,
    /**
     * Throw an error on encountering an already defined bundle.
     */
    error,
}

/**
 * Options relevent to UserFrosting's Sprinkle system.
 */
interface SprinkleOptions {
    /**
     * Optional specification for how to handle bundle collisions.
     */
    onCollision?: CollisionReactions | string;
}

/**
 * Represents an asset bundles root options node.
 */
interface Options {
    sprinkle?: SprinkleOptions;
}

/**
 * Represents an asset bundle
 */
export interface Bundle {
    scripts?: string[];
    styles?: string[];
    options?: Options;
}

/**
 * Map of bundles.
 */
interface Bundles {
    [x: string]: Bundle;
}

/**
 * Root object of raw configuration.
 */
export interface Config {
    /**
     * Bundle definitions.
     */
    bundle?: Bundles;

    /**
     * Optional logger that will be used throughout bundling process.
     */
    Logger?: Logger;
}
