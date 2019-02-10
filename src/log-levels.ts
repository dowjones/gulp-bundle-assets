/**
 * Log levels.
 */
export enum LogLevel {
    /**
     * A lot will be tagged as silly.
     * These messages should only be used for debugging.
     * Creativity may be required to distill anything useful.
     */
    Silly,
    /**
     * General events of note such as progress milestones.
     */
    Normal,
    /**
     * Anything that is notable but doesn't result in an error will be logged with this.
     * This includes any detected bad practises or habits.
     */
    Complain,
    /**
     * Shit is about to hit the fan. Expect an unrecoverable error very soon.
     */
    Scream
}
