import { IAdminFormState } from "../reducers/admin";

export enum AdminTypeKeys {
  SET_FORM_STATE = "SET_FORM_STATE",
  SET_FORM_FIELD = "SET_FORM_FIELD"
}

interface SetFormStateAction {
  type: AdminTypeKeys.SET_FORM_STATE;
  state: IAdminFormState;
}

interface SetFormFieldAction {
  type: AdminTypeKeys.SET_FORM_FIELD;
  field: string;
  value: string;
}

export type AdminTypes = SetFormStateAction | SetFormFieldAction;

export function setFormState(state: IAdminFormState) {
  return {
    type: AdminTypeKeys.SET_FORM_STATE,
    state
  };
}

export function setFormField(field: string, value: string) {
  return {
    type: AdminTypeKeys.SET_FORM_FIELD,
    field,
    value
  };
}

export default { setFormState, setFormField };
