// import { CustomEvents, CustomStates } from "./customTypes";

// /*==============================
// ||     General Properties     ||
// ==============================*/

// export type Duration = {
//   start: number;
//   end: number;
// };

// export type Phase = "AUTO" | "TELEOP" | "ENDGAME";

// /*==============================
// ||      Game Properties       ||
// ==============================*/

// interface IGameProperties {
//   matchDuration: number;
//   autoDuration: number;
//   teleopDuration: number;
//   endgameDuration: number;
//   auto: Duration;
//   teleop: Duration;
//   endgame: Duration;
// }

// export const gameProperties: IGameProperties = {
//   matchDuration: 150,
//   autoDuration: 15,
//   teleopDuration: 135,
//   endgameDuration: 30,
//   auto: { start: 0, end: 15 },
//   teleop: { start: 15, end: 150 },
//   endgame: { start: 120, end: 150 }
// };

// /*==============================
// ||           Events           ||
// ==============================*/

// // enum AutoScorableEvents {
// //   INITIATION = 5,
// //   POWERCELLS_BOTTOM = 2,
// //   POWERCELLS_OUTER = 4,
// //   POWERCELLS_INNER = 6
// // }

// enum ScorableRobotEvents {
//   INITIATION = "INITIATION",
//   POWERCELLS_BOTTOM = "POWERCELLS_BOTTOM",
//   POWERCELLS_OUTER = "POWERCELLS_OUTER",
//   POWERCELLS_INNER = "POWERCELLS_INNER",
//   ROTATION_CONTROL = "ROTATION_CONTROL",
//   POSITION_CONTROL = "POSITION_CONTROL",
//   HANG = "HANG",
//   PARK = "PANK"
// }

// enum ScorableTeamEvents {
//   LEVEL = "LEVEL"
// }

// export type ScorableEvents = ScorableRobotEvents | ScorableTeamEvents;

// enum FoulEvents {
//   FOUL = "FOUL",
//   TECH_FOUL = "TECH_FOUL",
//   YELLOW_CARD = "YELLOW_CARD",
//   RED_CARD = "RED_CARD",
//   DISABLE = "DISABLE"
// }

// enum TeamEvents {
//   OPERATIONAL = "OPERATIONAL",
//   ENERGIZED = "ENERGIZED",
//   TIE = "TIE",
//   WIN = "WIN",
//   DISQUALIFIED = "DISQUALIFIED",
//   STAGE_ONE = "STAGE_ONE",
//   STAGE_TWO = "STAGE_TWO",
//   STAGE_THREE = "STAGE_THREE"
// }

// /*==============================
// ||           State            ||
// ==============================*/

// enum RobotStates {
//   WHEEL = "WHEEL",
//   SHOOTING = "SHOOTING",
//   GATHERING = "GATHERING",
//   CLIMBING = "CLIMBING",
//   DEFENDING = "DEFENDING"
// }

// /*==============================
// ||   Interfaces / Type Keys   ||
// ==============================*/

// // ========== Robot ==========
// export type EventTypes = ScorableRobotEvents | FoulEvents | CustomEvents;

// export const RobotEventTypes = [
//   ...Object.values(ScorableRobotEvents),
//   ...Object.values(FoulEvents),
//   ...Object.values(CustomEvents)
// ];

// export interface RobotEvent {
//   type: ScorableRobotEvents | FoulEvents | CustomEvents;
//   start: Date;
// }

// // ========== Team ==========
// export const TeamEventTypes = [
//   ...Object.values(TeamEvents),
//   ...Object.values(ScorableTeamEvents)
// ];

// export interface TeamEvent {
//   type: TeamEvents | ScorableTeamEvents;
//   start: Date;
// }

// // ========== State ==========
// export type StateTypes = RobotStates | CustomStates;

// export const RobotStateTypes = [
//   ...Object.values(RobotStates),
//   ...Object.values(CustomStates)
// ];

// export interface RobotState {
//   type: StateTypes;
//   start?: Date;
//   end?: Date;
// }
