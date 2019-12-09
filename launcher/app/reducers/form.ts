import { FormTypeKeys, FormTypes } from '../actions/form';
import DataStore from '../classes/DataStore';

const dataStore = new DataStore();

interface IFormState {
    serverPort: number;
    dbPort: number;
}

const initialState: IFormState = {
    serverPort: dataStore.get('serverPort') | 3000,
    dbPort: dataStore.get('dbPort') | 27017
};

export default function form(
    state: IFormState = initialState,
    action: FormTypes
) {
    switch (action.type) {
        case FormTypeKeys.UPDATE_FORM_STATE:
            return {
                serverPort: action.serverPort,
                dbPort: action.dbPort
            };
        default:
            return state;
    }
}
