export enum DataTypeKeys {
  UPDATE_MATCH_DATA = "UPDATE_MATCH_DATA"
}

interface UpdateMatchDataAction {
  type: DataTypeKeys.UPDATE_MATCH_DATA;
}

export type DataTypes = UpdateMatchDataAction;

/**
 * Updates the match data stored in the state. This is generally called after all the scouts have submitted their forms
 */
export function updateMatchData() {
  return {
    type: DataTypeKeys.UPDATE_MATCH_DATA
  };
}

export default { updateMatchData };
