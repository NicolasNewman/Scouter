import { ScoutingTypeKeys, ScoutingTypes } from "../actions/scouting";

export type ScoutingTargetState = {
  scoutingTargets: Array<string>;
  matchNumber: string;
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
