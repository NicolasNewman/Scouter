import { IRobotEvent, ITeamEvent, IRobotState, Duration } from "./gameTypes";

/**
 * Match Models
 */
export type VritualizedMatches = Array<IVirtualizedMatch>;

export interface IVirtualizedMatch {
  matchNumber?: number;
  teamNumber: number;
  alliance: string;
  robotEvents: Array<IRobotEvent>;
  robotStates: Array<IRobotState>;
  points: number;
  accuracy: {
    [key: string]: number;
  };
  cycle: Array<ICycle>;
}

export interface ICycle {
  interval: Duration;
  cycleEvents: Array<IRobotEvent>;
  cycleStates: Array<IRobotState>;
}

/**
 * Game Models
 */

export interface IGame {
  matchNumber: number;
  red: {
    s1: IVirtualizedMatch;
    s2: IVirtualizedMatch;
    s3: IVirtualizedMatch;
    teamEvents: ITeamEvent;
  };
  blue: {
    s1: IVirtualizedMatch;
    s2: IVirtualizedMatch;
    s3: IVirtualizedMatch;
    teamEvents: ITeamEvent;
  };
}

/**
 * Team Models
 */

export interface ITeam {
  teamNumber: number;
  teamName: string;
  matches: Array<IVirtualizedMatch>;
}
