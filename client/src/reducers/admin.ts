import { AdminTypeKeys, AdminTypes } from "../actions/admin";

export interface IAdminFormState {
  "r-s1-team": string;
  "r-s1-scout": string;
  "r-s2-team": string;
  "r-s2-scout": string;
  "r-s3-team": string;
  "r-s3-scout": string;
  "b-s1-team": string;
  "b-s1-scout": string;
  "b-s2-team": string;
  "b-s2-scout": string;
  "b-s3-team": string;
  "b-s3-scout": string;
}

export interface IAdminScoutStatus {
  "r-s1-scout": boolean;
  "r-s2-scout": boolean;
  "r-s3-scout": boolean;
  "b-s1-scout": boolean;
  "b-s2-scout": boolean;
  "b-s3-scout": boolean;
}

const falseScoutStatus: IAdminScoutStatus = {
  "r-s1-scout": false,
  "r-s2-scout": false,
  "r-s3-scout": false,
  "b-s1-scout": false,
  "b-s2-scout": false,
  "b-s3-scout": false
};

const blankAdminFormState: IAdminFormState = {
  "r-s1-team": "string",
  "r-s1-scout": "string",
  "r-s2-team": "string",
  "r-s2-scout": "string",
  "r-s3-team": "string",
  "r-s3-scout": "string",
  "b-s1-team": "string",
  "b-s1-scout": "string",
  "b-s2-team": "string",
  "b-s2-scout": "string",
  "b-s3-team": "string",
  "b-s3-scout": "string"
};

export enum MainTabKeys {
  DB_ENTRY = "DB_ENTRY",
  ASSIGNMENT_FORM = "ASSIGNMENT_FORM"
}

export type AdminState = {
  formState: IAdminFormState;
  scoutStatus: IAdminScoutStatus;
  inProgress: boolean;
  keyOfSelectedMainTab: MainTabKeys;
};

const initialState: AdminState = {
  formState: {
    "r-s1-team": "",
    "r-s1-scout": "",
    "r-s2-team": "",
    "r-s2-scout": "",
    "r-s3-team": "",
    "r-s3-scout": "",
    "b-s1-team": "",
    "b-s1-scout": "",
    "b-s2-team": "",
    "b-s2-scout": "",
    "b-s3-team": "",
    "b-s3-scout": ""
  },
  scoutStatus: falseScoutStatus,
  inProgress: false,
  keyOfSelectedMainTab: MainTabKeys.DB_ENTRY
};

export default function user(
  state: AdminState = initialState,
  action: AdminTypes
) {
  switch (action.type) {
    case AdminTypeKeys.SET_FORM_STATE:
      return {
        formState: action.state,
        scoutStatus: state.scoutStatus,
        inProgress: state.inProgress,
        keyOfSelectedMainTab: state.keyOfSelectedMainTab
      };
    case AdminTypeKeys.SET_FORM_FIELD:
      const newState: IAdminFormState = state.formState;
      newState[action.field] = action.value;
      return {
        formState: newState,
        scoutStatus: state.scoutStatus,
        inProgress: state.inProgress,
        keyOfSelectedMainTab: state.keyOfSelectedMainTab
      };
    case AdminTypeKeys.START_SESSION:
      return {
        formState: state.formState,
        scoutStatus: falseScoutStatus,
        inProgress: true,
        keyOfSelectedMainTab: state.keyOfSelectedMainTab
      };
    case AdminTypeKeys.END_SESSION:
      return {
        formState: state.formState,
        scoutStatus: state.scoutStatus,
        inProgress: false,
        keyOfSelectedMainTab: state.keyOfSelectedMainTab
      };
    case AdminTypeKeys.SET_SCOUT_STATUS:
      if (state.inProgress) {
        const newStatus: IAdminScoutStatus = Object.assign(
          {},
          state.scoutStatus
        );
        newStatus[action.scout] = action.status;

        let key: keyof IAdminScoutStatus;
        let isAllDone = true;
        for (key in newStatus) {
          if (!newStatus[key]) {
            isAllDone = false;
          }
        }

        // If all of the scouts are done, reset the state
        if (isAllDone) {
          return {
            formState: blankAdminFormState,
            scoutStatus: falseScoutStatus,
            inProgress: false,
            keyOfSelectedMainTab: state.keyOfSelectedMainTab
          };
        } else {
          return {
            formState: state.formState,
            scoutStatus: newStatus,
            inProgress: state.inProgress,
            keyOfSelectedMainTab: state.keyOfSelectedMainTab
          };
        }
      } else {
        return state;
      }
    case AdminTypeKeys.SET_SELECTED_MAIN_TAB:
      return {
        formState: state.formState,
        scoutStatus: state.scoutStatus,
        inProgress: state.inProgress,
        keyOfSelectedMainTab: action.key
      };
    default:
      return state;
  }
}
