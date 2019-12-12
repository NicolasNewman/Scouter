export enum FormTypeKeys {
    UPDATE_FORM_STATE = 'UPDATE_FORM_STATE'
}

interface UpdateFormAction {
    type: FormTypeKeys.UPDATE_FORM_STATE;
    serverPort: number;
    dbPort: number;
}

export type FormTypes = UpdateFormAction;

/**
 * Signals the reducer to globally update the state with the submitted form fields
 * @param serverPort the port used to connect to the webapp
 * @param dbPort the port used to connect to the database
 */
export function updateFormState(
    serverPort: number,
    dbPort: number
): UpdateFormAction {
    return {
        type: FormTypeKeys.UPDATE_FORM_STATE,
        serverPort,
        dbPort
    };
}

export default { updateFormState };
