export enum FormTypeKeys {
    UPDATE_FORM_STATE = 'UPDATE_FORM_STATE'
}

interface UpdateFormAction {
    type: FormTypeKeys.UPDATE_FORM_STATE;
    dbName: string;
    adminPassword: string;
    filePath: string;
}

export type FormTypes = UpdateFormAction;

/**
 * Signals the reducer to globally update the state with the submitted form fields
 * @param serverPort the port used to connect to the webapp
 * @param dbPort the port used to connect to the database
 */
export function updateFormState(
    dbName: string,
    adminPassword: string,
    filePath: string
): UpdateFormAction {
    return {
        type: FormTypeKeys.UPDATE_FORM_STATE,
        dbName,
        adminPassword,
        filePath
    };
}

export default { updateFormState };
