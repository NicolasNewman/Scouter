import { ScoutingTypeKeys, ScoutingTypes } from "../actions/scouting";

export type ScoutingTargetState = {
  scoutingTargets: Array<string>;
  isActive: boolean;
};

const initialState: ScoutingTargetState = {
  scoutingTargets: [],
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
        isActive: true
      };
    case ScoutingTypeKeys.UPDATE_SCOUTING_STATUS:
      return {
        targets: state.scoutingTargets,
        isActive: action.isActive
      };
    default:
      return state;
  }
}
