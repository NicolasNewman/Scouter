import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import { History } from 'history';
import form from './form';
import log from './log';

export default function createRootReducer(history: History) {
    return combineReducers({
        router: connectRouter(history),
        form,
        log
    });
}
