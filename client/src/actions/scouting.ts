import { ScoutingTargets } from "../classes/socketController";

export enum ScoutingTypeKeys {
  SET_SCOUTING_TARGETS = "SET_SCOUTING_TARGETS",
  UPDATE_SCOUTING_STATUS = "UPDATE_SCOUTING_STATUS"
}

interface SetScoutingTargetsAction {
  type: ScoutingTypeKeys.SET_SCOUTING_TARGETS;
  targets: ScoutingTargets;
  matchNumber: number;
}

interface UpdateScoutingStatus {
  type: ScoutingTypeKeys.UPDATE_SCOUTING_STATUS;
  isActive: boolean;
}

export type ScoutingTypes = SetScoutingTargetsAction | UpdateScoutingStatus;

export function setScoutingTargets(
  targets: ScoutingTargets,
  matchNumber: number
) {
  return {
    type: ScoutingTypeKeys.SET_SCOUTING_TARGETS,
    targets,
    matchNumber
  };
}

export function updateScoutingStatus(isActive: boolean) {
  return {
    type: ScoutingTypeKeys.UPDATE_SCOUTING_STATUS,
    isActive
  };
}

export default { setScoutingTargets, updateScoutingStatus };
