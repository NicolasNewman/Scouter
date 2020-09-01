export enum LogTypeKeys {
    LOG = 'LOG',
    CREATE_LOG = 'CREATE_LOG',
    DELETE_LOG = 'DELETE_LOG'
}

interface LogAction {
    type: LogTypeKeys.LOG;
    name: string;
    text: string;
    level: 'MESSAGE' | 'WARNING' | 'ERROR';
}

interface CreateLogAction {
    type: LogTypeKeys.CREATE_LOG;
    name: string;
}

interface DeleteLogAction {
    type: LogTypeKeys.DELETE_LOG;
    name: string;
}

export type LogTypes = LogAction | CreateLogAction | DeleteLogAction;

/**
 * Appends an event to the log as a new line
 * @param event the event to log
 */
export function logEvent(name: string, text: string, level: 'MESSAGE' | 'WARNING' | 'ERROR'): LogAction {
    return {
        type: LogTypeKeys.LOG,
        name,
        text,
        level
    };
}

export function createLog(name: string): CreateLogAction {
    return {
        type: LogTypeKeys.CREATE_LOG,
        name
    };
}

export function deleteLog(name: string): DeleteLogAction {
    return {
        type: LogTypeKeys.DELETE_LOG,
        name
    };
}

export default { logEvent, createLog, deleteLog };
