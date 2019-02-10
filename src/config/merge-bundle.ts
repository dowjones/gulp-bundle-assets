import { Bundle, CollisionReactions } from "./config";
import Extend from "just-extend";

/**
 * Merges 2 bundles, respecting the collision logic of the second bundle if specified.
 * @param existingBundle Bundle to merge into.
 * @param nextBundle Bundle bringing new content.
 */
export default function MergeBundle(existingBundle: Bundle, nextBundle: Bundle): Bundle {
    // Determine collision resolution strategy
    let collisionReaction = CollisionReactions.replace;

    if (nextBundle.options
        && nextBundle.options.sprinkle
        && nextBundle.options.sprinkle.onCollision) {
        collisionReaction = CollisionReactions[nextBundle.options.sprinkle.onCollision];
    }

    // Do merge
    switch (collisionReaction) {
        // Replace - Return the next bundle
        case CollisionReactions.replace:
            return nextBundle;
        // Merge
        case CollisionReactions.merge: {
            // Merge arrays manually if needed
            if (existingBundle.scripts && nextBundle.scripts)
                nextBundle.scripts = [...new Set([...existingBundle.scripts, ...nextBundle.scripts])];
            if (existingBundle.styles && nextBundle.styles)
                nextBundle.styles = [...new Set([...existingBundle.styles, ...nextBundle.styles])];

            // TODO Worth noting that there is no typing for Extend currently
            return Extend(true, existingBundle, nextBundle);
        }
        // Ignore - Return existing bundle
        case CollisionReactions.ignore:
            return existingBundle;
        // Error, better known as EVERYBODY PANIC!
        case CollisionReactions.error:
            throw new Error(`The bundle has been previously defined, and the bundle's 'onCollision' property is set to 'error'.`);
        default:
            throw new Error(`Unexpected input '${nextBundle.options.sprinkle.onCollision}' for 'onCollision' option of next bundle.`);
    }
}
