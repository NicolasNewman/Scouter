import { CustomEvents, CustomStates } from "./customTypes";

/*==============================
||     General Properties     ||
==============================*/

export type Duration = {
  start: number;
  end: number;
};

export type Phase = "AUTO" | "TELEOP" | "ENDGAME";

/*==============================
||      Game Properties       ||
==============================*/

interface IGameProperties {
  matchDuration: number;
  autoDuration: number;
  teleopDuration: number;
  endgameDuration: number;
  auto: Duration;
  teleop: Duration;
  endgame: Duration;
}

export const gameProperties: IGameProperties = {
  matchDuration: 150,
  autoDuration: 15,
  teleopDuration: 135,
  endgameDuration: 30,
  auto: { start: 0, end: 15 },
  teleop: { start: 15, end: 150 },
  endgame: { start: 120, end: 150 }
};

/*==============================
||           Events           ||
==============================*/

// enum AutoScorableEvents {
//   INITIATION = 5,
//   POWERCELLS_BOTTOM = 2,
//   POWERCELLS_OUTER = 4,
//   POWERCELLS_INNER = 6
// }

export enum ScorableRobotEvents {
  INITIATION = "INITIATION",
  POWERCELLS_BOTTOM = "POWERCELLS_BOTTOM",
  POWERCELLS_OUTER = "POWERCELLS_OUTER",
  POWERCELLS_INNER = "POWERCELLS_INNER",
  ROTATION_CONTROL = "ROTATION_CONTROL",
  POSITION_CONTROL = "POSITION_CONTROL",
  HANG = "HANG",
  PARK = "PARK"
}

export enum ScorableTeamEvents {
  LEVEL = "LEVEL"
}

export enum FoulEvents {
  FOUL = "FOUL",
  TECH_FOUL = "TECH_FOUL",
  YELLOW_CARD = "YELLOW_CARD",
  RED_CARD = "RED_CARD",
  DISABLE = "DISABLE"
}

export enum TeamEvents {
  OPERATIONAL = "OPERATIONAL",
  ENERGIZED = "ENERGIZED",
  TIE = "TIE",
  WIN = "WIN",
  DISQUALIFIED = "DISQUALIFIED",
  STAGE_ONE = "STAGE_ONE",
  STAGE_TWO = "STAGE_TWO",
  STAGE_THREE = "STAGE_THREE"
}

/*==============================
||           State            ||
==============================*/

export enum RobotStates {
  WHEEL = "WHEEL",
  SHOOTING = "SHOOTING",
  GATHERING = "GATHERING",
  CLIMBING = "CLIMBING",
  DEFENDING = "DEFENDING"
}

/*==============================
||   Interfaces / Type Keys   ||
==============================*/

// ========== Robot ==========
export type RobotEvents = ScorableRobotEvents | FoulEvents | CustomEvents;
export type ScorableEvents = ScorableRobotEvents | ScorableTeamEvents;
export type Events =
  | ScorableRobotEvents
  | FoulEvents
  | CustomEvents
  | TeamEvents
  | ScorableTeamEvents;

// export const RobotEventTypes = [
//   ...Object.values(ScorableRobotEvents),
//   ...Object.values(FoulEvents),
//   ...Object.values(CustomEvents)
// ];

export interface IRobotEvent {
  type: ScorableRobotEvents | FoulEvents | CustomEvents;
  start: number;
  score?: number;
}

// ========== Team ==========
// export const TeamEventTypes = [
//   ...Object.values(TeamEvents),
//   ...Object.values(ScorableTeamEvents)
// ];

export interface ITeamEvent {
  type: TeamEvents | ScorableTeamEvents;
  start: number;
  score?: number;
}

// ========== Scorable ==========
// export const ScorableEventTypes = [
//   ...Object.values(ScorableRobotEvents),
//   ...Object.values(ScorableTeamEvents)
// ];

// ========== State ==========
export type StateTypes = RobotStates | CustomStates;

// export const RobotStateTypes = [
//   ...Object.values(RobotStates),
//   ...Object.values(CustomStates)
// ];

export interface RobotState {
  type: StateTypes;
  start?: number;
  end?: number;
}
