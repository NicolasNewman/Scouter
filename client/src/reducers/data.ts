import { DataTypeKeys, DataTypes } from "../actions/data";
import * as constants from "../constants/constants.json";
import RequestHandler from "../classes/RequestHandler";

interface IMatch {
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

type TeamData = Array<IMatch>;

export interface ICompetitionData {
  [team: string]: TeamData;
}

export type DataState = {
  matchData: ICompetitionData;
};

const initialState: DataState = {
  matchData: {}
};

// TODO CONSTANT URL
const requestHandler = new RequestHandler(constants.apiRoute);

export default function data(
  state: DataState = initialState,
  action: DataTypes
) {
  switch (action.type) {
    case DataTypeKeys.UPDATE_MATCH_DATA:
      return {
        matchData: {}
      };
    default:
      return state;
  }
}
