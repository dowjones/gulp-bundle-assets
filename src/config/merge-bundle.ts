import { Bundle, CollisionReactions } from "./config.js";
import extend from "just-extend";

/**
 * Merges 2 bundles, respecting the collision logic of the second bundle if specified.
 * @param existingBundle Bundle to merge into.
 * @param nextBundle Bundle bringing new content.
 */
export default function MergeBundle(existingBundle: Bundle, nextBundle: Bundle): Bundle {
    // Determine collision resolution strategy
    let collisionReaction = CollisionReactions.replace;

    const rawCollisionRule = nextBundle?.options?.sprinkle?.onCollision;

    if (rawCollisionRule) {
        collisionReaction = CollisionReactions[rawCollisionRule];
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

            return extend(true, existingBundle, nextBundle);
        }
        // Ignore - Return existing bundle
        case CollisionReactions.ignore:
            return existingBundle;
        // Error, better known as EVERYBODY PANIC!
        case CollisionReactions.error:
            throw new Error(`The bundle has been previously defined, and the bundle's 'onCollision' property is set to 'error'.`);
        default:
            throw new RangeError(`Unexpected input '${rawCollisionRule}' for 'onCollision' option of next bundle.`);
    }
}
