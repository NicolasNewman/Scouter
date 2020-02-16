import { DataTypeKeys, DataTypes } from "../actions/data";
import * as equal from "fast-deep-equal";
import { IGame, ITeam } from "../global/modelTypes";

export type DataState = {
  gameData: Array<IGame>;
  teamData: Array<ITeam>;
};

const initialState: DataState = {
  gameData: [],
  teamData: []
};

export default function data(
  state: DataState = initialState,
  action: DataTypes
) {
  switch (action.type) {
    case DataTypeKeys.UPDATE_MATCH_DATA:
      if (equal(state, action.data)) {
        return state;
      } else {
        return action.data;
      }
    default:
      return state;
  }
}
