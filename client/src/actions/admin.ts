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

/**
 * Updates the internal form state by replacing the old one
 *
 * @param state - the new state of the form
 */
export function setFormState(state: IAdminFormState) {
  return {
    type: AdminTypeKeys.SET_FORM_STATE,
    state
  };
}

/**
 * Updates a specific field of the internal form state, updating the old one
 * @param field - the field to update
 * @param value - the new value of the field
 */
export function setFormField(field: keyof IAdminFormState, value: string) {
  return {
    type: AdminTypeKeys.SET_FORM_FIELD,
    field,
    value
  };
}

/**
 * Signals the internal state to begin a new scouting session. This is generally before a new match
 */
export function startSession() {
  return {
    type: AdminTypeKeys.START_SESSION
  };
}

/**
 * Signals the internal state to end the current scouting session. This is generally at the end of a match, and once every scout has submited their form.
 */
export function endSession() {
  return {
    type: AdminTypeKeys.END_SESSION
  };
}

/**
 * Updates the status of a scout (if they are still in the process of scouting or not)
 * @param scout - the scout whose status should be updated
 * @param status - the status of the scout. True means they are done
 */
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

/**
 * Sets the tab that should be selected when re-rendering the Admin component. This is generally called when a new tab is selected
 * @param key - the key of the antd tab
 */
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
