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

export type AdminState = {
  formState: IAdminFormState;
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
  }
};

export default function user(
  state: AdminState = initialState,
  action: AdminTypes
) {
  switch (action.type) {
    case AdminTypeKeys.SET_FORM_STATE:
      return {
        formState: action.state
      };
    case AdminTypeKeys.SET_FORM_FIELD:
      const newState: IAdminFormState = state.formState;
      newState[action.field] = action.value;
      // newState[action.field] = action.value;
      return {
        formState: newState
      };
    default:
      return state;
  }
}
