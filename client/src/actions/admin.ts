import { IAdminFormState, IAdminScoutStatus } from "../reducers/admin";

export enum AdminTypeKeys {
  SET_FORM_STATE = "SET_FORM_STATE",
  SET_FORM_FIELD = "SET_FORM_FIELD",
  START_SESSION = "START_SESSION",
  END_SESSION = "END_SESSION",
  SET_SCOUT_STATUS = "SET_SCOUT_STATUS"
}

interface SetFormStateAction {
  type: AdminTypeKeys.SET_FORM_STATE;
  state: IAdminFormState;
}

interface SetFormFieldAction {
  type: AdminTypeKeys.SET_FORM_FIELD;
  field: keyof IAdminFormState;
  value: string;
}

interface StartSessionAction {
  type: AdminTypeKeys.START_SESSION;
}

interface EndSessionAction {
  type: AdminTypeKeys.END_SESSION;
}

interface SetScoutStatus {
  type: AdminTypeKeys.SET_SCOUT_STATUS;
  scout: keyof IAdminScoutStatus;
  status: boolean;
}

export type AdminTypes =
  | SetFormStateAction
  | SetFormFieldAction
  | StartSessionAction
  | EndSessionAction
  | SetScoutStatus;

export function setFormState(state: IAdminFormState) {
  return {
    type: AdminTypeKeys.SET_FORM_STATE,
    state
  };
}

export function setFormField(field: keyof IAdminFormState, value: string) {
  return {
    type: AdminTypeKeys.SET_FORM_FIELD,
    field,
    value
  };
}

export function startSession() {
  return {
    type: AdminTypeKeys.START_SESSION
  };
}

export function endSession() {
  return {
    type: AdminTypeKeys.END_SESSION
  };
}

export function setScoutStatus(
  scout: keyof IAdminScoutStatus,
  status: boolean
) {
  return {
    type: AdminTypeKeys.SET_SCOUT_STATUS,
    scout,
    status
  };
}

export default {
  setFormState,
  setFormField,
  startSession,
  endSession,
  setScoutStatus
};
