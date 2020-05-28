import TsLog from "ts-log";

/**
 * Rules for how a bundle collision may be treated.
 * @public
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
    error
}

/**
 * Options relevant to UserFrosting's Sprinkle system.
 * @public
 */
export interface SprinkleOptions {
    /**
     * How a bundle collision should be handled when bundles are being merged.
     */
    onCollision?: keyof typeof CollisionReactions;
}

/**
 * Represents an asset bundles root options node.
 * @public
 */
export interface Options {
    sprinkle?: SprinkleOptions;
}

/**
 * Represents an asset bundle
 * @public
 */
export interface Bundle {
    scripts?: string[];
    styles?: string[];
    options?: Options;
}

/**
 * Map of bundles.
 * @public
 */
export interface Bundles {
    [x: string]: Bundle;
}

/**
 * Root object of raw configuration.
 * @public
 */
export interface Config {
    /**
     * Bundle definitions.
     */
    bundle?: Bundles;

    /**
     * Optional logger that will be used throughout bundling process.
     */
    Logger?: TsLog.Logger;

    /**
     * Current working directory to use when resolving the full paths of bundle dependencies.
     * Defaults to `process.cwd()`.
     */
    cwd?: string;
}
