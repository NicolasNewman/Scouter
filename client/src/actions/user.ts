export enum UserTypeKeys {
  SET_USERNAME = "SET_USERNAME",
  SET_ADMIN = "SET_ADMIN"
}

interface SetUserAction {
  type: UserTypeKeys.SET_USERNAME;
  username: string;
}

interface SetAdminAction {
  type: UserTypeKeys.SET_ADMIN;
  isAdmin: boolean;
}

export type UserTypes = SetUserAction | SetAdminAction;

export function setUsername(username: string) {
  return {
    type: UserTypeKeys.SET_USERNAME,
    username
  };
}

export function setAdminStatus(isAdmin: boolean) {
  return {
    type: UserTypeKeys.SET_ADMIN,
    isAdmin
  };
}

export default { setUsername, setAdminStatus };
