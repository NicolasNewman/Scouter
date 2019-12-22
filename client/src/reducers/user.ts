import { UserTypeKeys, UserTypes } from "../actions/user";

export type UserState = {
  username: string;
  isAdmin: boolean;
  isAuthenticated: boolean;
};

const initialState = {
  username: "",
  isAdmin: false,
  isAuthenticated: false
};

export default function user(
  state: UserState = initialState,
  action: UserTypes
) {
  switch (action.type) {
    case UserTypeKeys.SET_USERNAME:
      return {
        username: action.username,
        isAdmin: state.isAdmin,
        isAuthenticated: true
      };
    case UserTypeKeys.SET_ADMIN:
      console.log("SETTING ADMIN STATUS");

      return {
        username: state.username,
        isAdmin: action.isAdmin,
        isAuthenticated: state.isAuthenticated
      };
    default:
      return state;
  }
}
