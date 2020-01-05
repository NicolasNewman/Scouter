import { compileData } from "../helper/matchDataCompiler";
import { ICompetitionData } from "../reducers/data";

export enum DataTypeKeys {
  UPDATE_MATCH_DATA = "UPDATE_MATCH_DATA"
}

interface UpdateMatchDataAction {
  type: DataTypeKeys.UPDATE_MATCH_DATA;
  data: ICompetitionData;
}

export type DataTypes = UpdateMatchDataAction;

/**
 * Updates the match data stored in the state. This is generally called after all the scouts have submitted their forms
 */
export function updateMatchData(data: ICompetitionData) {
  return {
    type: DataTypeKeys.UPDATE_MATCH_DATA,
    data
  };
}

// TODO proper TS integration
export function setMatchData() {
  return (dispatch: any) => {
    compileData().then(data => {
      dispatch(updateMatchData(data));
    });
  };
}

export default { setMatchData, updateMatchData };
