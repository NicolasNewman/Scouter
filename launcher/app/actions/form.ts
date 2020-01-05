export enum FormTypeKeys {
    UPDATE_FORM_STATE = 'UPDATE_FORM_STATE'
}

interface UpdateFormAction {
    type: FormTypeKeys.UPDATE_FORM_STATE;
    serverPort: number;
    dbPort: number;
    dbName: string;
    adminPassword: string;
}

export type FormTypes = UpdateFormAction;

/**
 * Signals the reducer to globally update the state with the submitted form fields
 * @param serverPort the port used to connect to the webapp
 * @param dbPort the port used to connect to the database
 */
export function updateFormState(
    serverPort: number,
    dbPort: number,
    dbName: string,
    adminPassword: string
): UpdateFormAction {
    return {
        type: FormTypeKeys.UPDATE_FORM_STATE,
        serverPort,
        dbPort,
        dbName,
        adminPassword
    };
}

export default { updateFormState };
