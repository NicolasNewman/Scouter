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

/**
 * Sets the username of the connected scout
 * @param username - the name of the scout
 */
export function setUsername(username: string) {
  return {
    type: UserTypeKeys.SET_USERNAME,
    username
  };
}

/**
 * Controls wheather or not the user is an admin.
 *
 * This is called from the socket and receives its parameter based on server-sided logic
 * @param isAdmin - wheather or not the user is an admin
 */
export function setAdminStatus(isAdmin: boolean) {
  return {
    type: UserTypeKeys.SET_ADMIN,
    isAdmin
  };
}

export default { setUsername, setAdminStatus };
