import { Phase, Events } from "./gameTypes";

const resolveScore = (event: Events, phase: Phase): number => {
  switch (event) {
    // Scorable Robot Events
    case "POWERCELLS_BOTTOM":
      switch (phase) {
        case "AUTO":
          return 2;
        case "TELEOP":
          return 1;
        case "ENDGAME":
          return 1;
        default:
          return 0;
      }
    case "POWERCELLS_OUTER":
      switch (phase) {
        case "AUTO":
          return 4;
        case "TELEOP":
          return 2;
        case "ENDGAME":
          return 2;
        default:
          return 0;
      }
    case "POWERCELLS_INNER":
      switch (phase) {
        case "AUTO":
          return 6;
        case "TELEOP":
          return 3;
        case "ENDGAME":
          return 3;
        default:
          return 0;
      }
    case "ROTATION_CONTROL":
      switch (phase) {
        case "TELEOP":
          return 10;
        case "ENDGAME":
          return 10;
        default:
          return 0;
      }
    case "POSITION_CONTROL":
      switch (phase) {
        case "TELEOP":
          return 20;
        case "ENDGAME":
          return 20;
        default:
          return 0;
      }
    case "HANG":
      switch (phase) {
        case "ENDGAME":
          return 25;
        default:
          return 0;
      }
    case "PARK":
      switch (phase) {
        case "ENDGAME":
          return 5;
        default:
          return 0;
      }
    // Scorable Team Events
    case "LEVEL":
      switch (phase) {
        case "ENDGAME":
          return 15;
        default:
          return 0;
      }
    default:
      return 0;
  }
};

export default resolveScore;
