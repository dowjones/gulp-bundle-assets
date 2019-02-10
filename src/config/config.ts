import { LogLevel } from "../log-levels";

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
    error
}

/**
 * Options relevent to UserFrosting's Sprinkle system.
 */
interface SprinkleOptions {
    /**
     * TODO
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
 * Root object of raw configuration.
 */
export interface Config {
    /**
     * Bundle definitions.
     */
    bundle?: Bundles;

    /**
     * Defines path transformations that are used for overriding files.
     * Later rules result in a higher preference.
     * Duplicate matcher paths will end up being ignored.
     * All paths should be relative, or undefined behaviour may occur.
     */
    VirtualPathRules?: [string, string][];

    /**
     * Base path bundle resources will be resolved against.
     * Use to match against virtual path rules if they are used.
     * Defaults to current working directory.
     */
    BundlesVirtualBasePath?: string;

    /**
     * Optional logger that will be used throughout bundling process.
     * @param value Message to log.
     * @param level Log level for message.
     */
    Logger?(value: string, level: LogLevel): void;
}

/**
 * Map of bundles.
 */
interface Bundles {
    [x: string]: Bundle;
}
