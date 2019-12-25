import { ScoutingTypeKeys, ScoutingTypes } from "../actions/scouting";

export type ScoutingTargetState = {
  targets: Array<string>;
  isActive: boolean;
};

const initialState: ScoutingTargetState = {
  targets: [],
  isActive: false
};

export default function scouting(
  state: ScoutingTargetState,
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
        targets: state.targets,
        isActive: action.isActive
      };
    default:
      return state;
  }
}
