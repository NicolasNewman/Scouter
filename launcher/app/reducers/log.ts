import { LogTypeKeys, LogTypes } from '../actions/log';

interface ILogState {
    text: string;
}

const initialState: ILogState = {
    text: ''
};

const date = new Date();
export default function form(
    state: ILogState = initialState,
    action: LogTypes
) {
    switch (action.type) {
        case LogTypeKeys.SET_TEXT:
            return {
                text: action.text
            };
        case LogTypeKeys.LOG:
            const formatedEvent = `> [${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}] ${
                action.event
            }`;
            const appendedText =
                state.text === ''
                    ? formatedEvent
                    : state.text + '\n' + formatedEvent;
            return {
                text: appendedText
            };
        default:
            return state;
    }
}
