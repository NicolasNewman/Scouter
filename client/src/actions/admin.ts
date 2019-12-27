import {
  IAdminFormState,
  IAdminScoutStatus,
  MainTabKeys
} from "../reducers/admin";

export enum AdminTypeKeys {
  SET_FORM_STATE = "SET_FORM_STATE",
  SET_FORM_FIELD = "SET_FORM_FIELD",
  START_SESSION = "START_SESSION",
  END_SESSION = "END_SESSION",
  SET_SCOUT_STATUS = "SET_SCOUT_STATUS",
  SET_SELECTED_MAIN_TAB = "SET_SELECTED_MAIN_TAB"
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

interface SetScoutStatusAction {
  type: AdminTypeKeys.SET_SCOUT_STATUS;
  scout: keyof IAdminScoutStatus;
  status: boolean;
}

interface SetSelectedMainTabAction {
  type: AdminTypeKeys.SET_SELECTED_MAIN_TAB;
  key: MainTabKeys;
}

export type AdminTypes =
  | SetFormStateAction
  | SetFormFieldAction
  | StartSessionAction
  | EndSessionAction
  | SetScoutStatusAction
  | SetSelectedMainTabAction;

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

export function setSelectedMainTab(key: MainTabKeys) {
  return {
    type: AdminTypeKeys.SET_SELECTED_MAIN_TAB,
    key
  };
}

export default {
  setFormState,
  setFormField,
  startSession,
  endSession,
  setScoutStatus,
  setSelectedMainTab
};
