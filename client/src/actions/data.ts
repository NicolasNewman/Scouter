import { compileData } from "../helper/matchDataCompiler";
import { DataState } from "../reducers/data";

export enum DataTypeKeys {
  UPDATE_MATCH_DATA = "UPDATE_MATCH_DATA"
}

interface UpdateMatchDataAction {
  type: DataTypeKeys.UPDATE_MATCH_DATA;
  data: DataState;
}

export type DataTypes = UpdateMatchDataAction;

/**
 * Updates the match data stored in the state. This is generally called after all the scouts have submitted their forms
 */
export function updateMatchData(data: DataState) {
  return {
    type: DataTypeKeys.UPDATE_MATCH_DATA,
    data
  };
}

// TODO proper TS integration
export function setMatchData() {
  return (dispatch: any) => {
    compileData().then((data: any) => {
      dispatch(updateMatchData(data));
    });
  };
}

export default { setMatchData, updateMatchData };
