import { ScoutingTypeKeys, ScoutingTypes } from "../actions/scouting";
import { ScoutingTargets } from "../classes/socketController";

export type ScoutingTargetState = {
  scoutingTargets: ScoutingTargets;
  matchNumber: number;
  isActive: boolean;
};

const initialState: ScoutingTargetState = {
  scoutingTargets: [],
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
    case ScoutingTypeKeys.UPDATE_SCOUTING_STATUS:
      return {
        targets: state.scoutingTargets,
        matchNumber: state.matchNumber,
        isActive: action.isActive
      };
    default:
      return state;
  }
}
