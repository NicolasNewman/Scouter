import { LogTypeKeys, LogTypes } from '../actions/log';

interface ILogState {
    text: string;
}

const initialState: ILogState = {
    text: ''
};

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
            return {
                text: state.text + '\n' + action.event;
            };
        default:
            return state;
    }
}
