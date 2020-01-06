import { DataTypeKeys, DataTypes } from "../actions/data";
import * as equal from "fast-deep-equal";
import {
  calculateExtrema,
  calculateAverage
} from "../helper/matchDataCompiler";

export interface IMatch {
  csHatch: number;
  csCargo: number;
  r1Hatch: number;
  r2Hatch: number;
  r3Hatch: number;
  r1Cargo: number;
  r2Cargo: number;
  r3Cargo: number;
  // [other: string]: any;
}

export type TeamData = Array<IMatch>;

export interface ICompetitionData {
  [team: string]: TeamData;
}

export interface IStatisticData {
  [team: string]: IMatch;
}

export type DataState = {
  competitionData: ICompetitionData;
  teamMins: IStatisticData;
  teamMaxes: IStatisticData;
  teamAverages: IStatisticData;
};

const initialState: DataState = {
  competitionData: {},
  teamMins: {},
  teamMaxes: {},
  teamAverages: {}
};

export default function data(
  state: DataState = initialState,
  action: DataTypes
) {
  switch (action.type) {
    case DataTypeKeys.UPDATE_MATCH_DATA:
      if (equal(state.competitionData, action.data)) {
        return state;
      } else {
        return {
          competitionData: action.data,
          teamMins: calculateExtrema(action.data, "min"),
          teamMaxes: calculateExtrema(action.data, "max"),
          teamAverages: calculateAverage(action.data)
        };
      }
    default:
      return state;
  }
}
