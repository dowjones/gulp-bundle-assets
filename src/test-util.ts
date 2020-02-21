import { Logger } from "ts-log";
import { ExecutionContext } from "ava";

/**
 * Maps lib logging to ava logging to assist debugging of failing tests.
 * @param t Execution context for test. Needed to associate logs with tests.
 */
/* istanbul ignore next */
export function mapAvaLoggerToStandard(t: ExecutionContext): Logger {
    return {
        debug(message, ...optionalParams) {
            return t.log("DEBUG: " + message, ...optionalParams);
        },
        trace(message, ...optionalParams) {
            return t.log("TRACE: " + message, ...optionalParams);
        },
        info(message, ...optionalParams) {
            return t.log("INFO: " + message, ...optionalParams);
        },
        warn(message, ...optionalParams) {
            return t.log("WARN: " + message, ...optionalParams);
        },
        error(message, ...optionalParams) {
            return t.log("ERROR: " + message, ...optionalParams);
        },
    }
}
