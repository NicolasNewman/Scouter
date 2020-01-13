import { CustomEvents, CustomStates } from './customTypes';

/*==============================
||     General Properties     ||
==============================*/

type Duration = {
    start: number;
    end: number;
};

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

enum AutoScorableEvents {
    INITIATION = 5,
    POWERCELLS_BOTTOM = 2,
    POWERCELLS_OUTER = 4,
    POWERCELLS_INNER = 6
}

enum TeleopScorableEvents {
    POWERCELLS_BOTTOM = 1,
    POWERCELLS_OUTER = 2,
    POWERCELLS_INNER = 3,
    ROTATION_CONTROL = 10,
    POSITION_CONTROL = 20,
    HANG = 25,
    PARK = 5
}

enum FoulEvents {
    FOUL = -3,
    TECH_FOUL = -15,
    YELLOW_CARD = 0,
    RED_CARD = 0,
    DISABLE = 0
}

enum TeamEvents {
    LEVEL = 'LEVEL',
    OPERATIONAL = 'OPERATIONAL',
    ENERGIZED = 'ENERGIZED',
    TIE = 'TIE',
    WIN = 'WIN',
    DISQUALIFIED = 'DISQUALIFIED',
    STAGE_ONE = 'STAGE_ONE',
    STAGE_TWO = 'STAGE_TWO',
    STAGE_THREE = 'STAGE_THREE'
}

/*==============================
||           State            ||
==============================*/

enum RobotStates {
    WHEEL = 'WHEEL',
    SHOOTING = 'SHOOTING',
    GATHERING = 'GATHERING',
    CLIMBING = 'CLIMBING',
    DEFENDING = 'DEFENDING'
}

/*==============================
||   Interfaces / Type Keys   ||
==============================*/

// ========== Robot ==========
export const RobotEventTypes = [
    ...Object.values(AutoScorableEvents),
    ...Object.values(TeleopScorableEvents),
    ...Object.values(FoulEvents),
    ...Object.values(CustomEvents)
];

export interface RobotEvent {
    type:
        | keyof typeof AutoScorableEvents
        | keyof typeof TeleopScorableEvents
        | keyof typeof FoulEvents
        | keyof typeof CustomEvents;
    points:
        | AutoScorableEvents
        | TeleopScorableEvents
        | FoulEvents
        | CustomEvents;
    start: Date;
}

// ========== Team ==========
export const TeamEventTypes = Object.values(TeamEvents);

export interface TeamEvent {
    type: TeamEvents;
    start: Date;
}

// ========== State ==========
export const RobotStateTypes = [
    ...Object.values(RobotStates),
    ...Object.values(CustomStates)
];

export interface RobotState {
    type: RobotStates | CustomStates;
    start: Date;
    end: Date;
}
