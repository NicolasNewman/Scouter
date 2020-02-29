import { ECustomEvents, ECustomStates } from "./customTypes";

/*==============================
||     General Properties     ||
==============================*/

export type Duration = {
  start?: number;
  end?: number;
};

export type Phase = "AUTO" | "TELEOP" | "ENDGAME";

interface IGameProperties {
  matchDuration: number;
  autoDuration: number;
  teleopDuration: number;
  endgameDuration: number;
  auto: Duration;
  teleop: Duration;
  endgame: Duration;
}

/*==============================
||           Events           ||
==============================*/

// enum AutoScorableEvents {
//   INITIATION = 5,
//   POWERCELLS_BOTTOM = 2,
//   POWERCELLS_OUTER = 4,
//   POWERCELLS_INNER = 6
// }

export enum ERobotEvents {}

export enum EScorableRobotEvents {
  INITIATION = "INITIATION",
  POWERCELLS_BOTTOM = "POWERCELLS_BOTTOM",
  POWERCELLS_OUTER = "POWERCELLS_OUTER",
  POWERCELLS_INNER = "POWERCELLS_INNER",
  ROTATION_CONTROL = "ROTATION_CONTROL",
  POSITION_CONTROL = "POSITION_CONTROL",
  HANG = "HANG",
  PARK = "PARK"
}

export enum EFoulEvents {
  FOUL = "FOUL",
  TECH_FOUL = "TECH_FOUL",
  YELLOW_CARD = "YELLOW_CARD",
  RED_CARD = "RED_CARD",
  DISABLE = "DISABLE"
}

export enum ETeamEvents {
  OPERATIONAL = "OPERATIONAL",
  ENERGIZED = "ENERGIZED",
  TIE = "TIE",
  WIN = "WIN",
  DISQUALIFIED = "DISQUALIFIED",
  STAGE_ONE = "STAGE_ONE",
  STAGE_TWO = "STAGE_TWO",
  STAGE_THREE = "STAGE_THREE"
}

export enum EScorableTeamEvents {
  LEVEL = "LEVEL"
}

/*==============================
||           State            ||
==============================*/

export enum ERobotStates {
  WHEEL = "WHEEL",
  SHOOTING = "SHOOTING",
  GATHERING = "GATHERING",
  CLIMBING = "CLIMBING",
  DEFENDING = "DEFENDING",
  DEFENDED = "DEFENDED"
}

/*==============================
||           Types            ||
==============================*/

export type RobotEvent =
  | ERobotEvents
  | EScorableRobotEvents
  | EFoulEvents
  | ECustomEvents;

export type TeamEvent = ETeamEvents | EScorableTeamEvents;

export type ScorableEvent = EScorableRobotEvents | EScorableTeamEvents;

export type Event =
  | ERobotEvents
  | EScorableRobotEvents
  | EFoulEvents
  | ECustomEvents
  | ETeamEvents
  | EScorableTeamEvents;

export type State = ERobotStates | ECustomStates;

// export const RobotEventTypes = [
//   ...Object.values(ScorableRobotEvents),
//   ...Object.values(FoulEvents),
//   ...Object.values(CustomEvents)
// ];

/*==============================
||     DB Model Interfaces    ||
==============================*/

export interface IRobotEvent {
  type: RobotEvent;
  start: number;
  points?: number;
  success?: number;
}

export interface ITeamEvent {
  type: TeamEvent;
  start: number;
  points?: number;
}

export interface IRobotState {
  type: State;
  start?: number;
  end?: number;
}

/*==============================
||        Event Arrays        ||
==============================*/

export const RobotEventList = [
  ...Object.values(ERobotEvents),
  ...Object.values(EScorableRobotEvents),
  ...Object.values(EFoulEvents),
  ...Object.values(ECustomEvents)
];

export const TeamEventList = [
  ...Object.values(ETeamEvents),
  ...Object.values(EScorableTeamEvents)
];

export const ScorableEventList = [
  ...Object.values(EScorableRobotEvents),
  ...Object.values(EScorableTeamEvents)
];

export const EventList = [
  ...Object.values(ERobotEvents),
  ...Object.values(EScorableRobotEvents),
  ...Object.values(EFoulEvents),
  ...Object.values(ECustomEvents),
  ...Object.values(ETeamEvents),
  ...Object.values(EScorableTeamEvents)
];

export const StateList = [
  ...Object.values(ERobotStates),
  ...Object.values(ECustomStates)
];

/*==============================
||      Game Properties       ||
==============================*/

export const gameProperties: IGameProperties = {
  matchDuration: 150,
  autoDuration: 15,
  teleopDuration: 135,
  endgameDuration: 30,
  auto: { start: 0, end: 15 },
  teleop: { start: 15, end: 150 },
  endgame: { start: 120, end: 150 }
};

export const cycleDeterminer = ERobotStates.GATHERING;
