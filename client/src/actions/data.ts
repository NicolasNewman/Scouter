import { ICompetitionData } from "../reducers/data";

export enum DataTypeKeys {
  UPDATE_MATCH_DATA = "UPDATE_MATCH_DATA"
}

interface UpdateMatchDataAction {
  type: DataTypeKeys.UPDATE_MATCH_DATA;
}

export type DataTypes = UpdateMatchDataAction;

export function updateMatchData() {
  return {
    type: DataTypeKeys.UPDATE_MATCH_DATA
  };
}

export default { updateMatchData };
