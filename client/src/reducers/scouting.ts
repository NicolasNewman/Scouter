import {
  ScoutingTypeKeys,
  ScoutingTypes,
  setScoutingTargets
} from "../actions/scouting";
import { ScoutingTargets } from "../classes/socketController";

export type ScoutingTargetState = {
  targets: ScoutingTargets;
  matchNumber: number;
  isActive: boolean;
};

const initialState: ScoutingTargetState = {
  targets: [],
  matchNumber: -1,
  isActive: false
};

export default function scouting(
  state: ScoutingTargetState = initialState,
  action: ScoutingTypes
) {
  switch (action.type) {
    case ScoutingTypeKeys.SET_SCOUTING_TARGETS:
      return {
        targets: action.targets,
        matchNumber: action.matchNumber,
        isActive: true
      };
    case ScoutingTypeKeys.REOMVE_SCOUTING_TARGET:
      console.log("In reducer");
      console.log(state);

      let targetsCopy = [...state.targets];

      console.log(targetsCopy);
      console.log(action.target);
      targetsCopy = targetsCopy.filter(
        targets => targets.team !== action.target
      );
      return {
        targets: targetsCopy,
        matchNumber: state.matchNumber,
        isActive: state.isActive
      };
    case ScoutingTypeKeys.UPDATE_SCOUTING_STATUS:
      return {
        targets: state.targets,
        matchNumber: state.matchNumber,
        isActive: action.isActive
      };
    default:
      return state;
  }
}
