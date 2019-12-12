export enum LogTypeKeys {
    SET_TEXT = 'SET_TEXT',
    LOG = 'LOG'
}

interface SetTextAction {
    type: LogTypeKeys.SET_TEXT;
    text: string;
}

interface LogAction {
    type: LogTypeKeys.LOG;
    event: string;
}

export type LogTypes = SetTextAction | LogAction;

/**
 * Overwrites the log with the provided text
 * @param text text to override the log with
 */
export function setLogText(text: string): SetTextAction {
    return {
        type: LogTypeKeys.SET_TEXT,
        text
    };
}

/**
 * Appends an event to the log as a new line
 * @param event the event to log
 */
export function logEvent(event: string): LogAction {
    return {
        type: LogTypeKeys.LOG,
        event
    };
}

export default { setLogText, logEvent };
