import { LogTypeKeys, LogTypes } from '../actions/log';

export interface LogEvent {
    message: string;
    level: 'MESSAGE' | 'WARNING' | 'ERROR';
}

export type LogEvents = LogEvent[];

export type Logs = {
    [name: string]: LogEvents;
};

const initialState: Logs = {};

export default function form(state: Logs = initialState, action: LogTypes) {
    switch (action.type) {
        case LogTypeKeys.LOG:
            const logCpy: Logs = JSON.parse(JSON.stringify(state));
            if (!logCpy[action.name]) {
                logCpy[action.name] = [];
            }
            logCpy[action.name].push({ message: action.text, level: action.level });
            return logCpy;
        case LogTypeKeys.CREATE_LOG:
            const createCpy: LogEvents = JSON.parse(JSON.stringify(state));
            if (!createCpy[action.name]) {
                createCpy[action.name] = [];
            }
            return createCpy;
        case LogTypeKeys.DELETE_LOG:
            const deleteCpy: LogEvents = JSON.parse(JSON.stringify(state));
            if (deleteCpy[action.name]) {
                delete deleteCpy[action.name];
            }
            return deleteCpy;
        default:
            return state;
    }
}
