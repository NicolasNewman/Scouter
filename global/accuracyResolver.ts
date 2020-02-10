import { Event } from "./gameTypes";

const resolveAccuracy = (event: Event): boolean => {
  switch (event) {
    // Scorable Robot Events
    case "POWERCELLS_INNER":
      return true;
    case "POWERCELLS_OUTER":
      return true;
    case "POWERCELLS_BOTTOM":
      return true;
    default:
      return false;
  }
};

export default resolveAccuracy;
