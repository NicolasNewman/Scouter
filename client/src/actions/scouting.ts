import { ScoutingTargets } from "../classes/socketController";

export enum ScoutingTypeKeys {
  SET_SCOUTING_TARGETS = "SET_SCOUTING_TARGETS",
  REOMVE_SCOUTING_TARGET = "REMOVE_SCOUTING_TARGET",
  UPDATE_SCOUTING_STATUS = "UPDATE_SCOUTING_STATUS"
}

interface SetScoutingTargetsAction {
  type: ScoutingTypeKeys.SET_SCOUTING_TARGETS;
  targets: ScoutingTargets;
  matchNumber: number;
}

interface RemoveScoutingTarget {
  type: ScoutingTypeKeys.REOMVE_SCOUTING_TARGET;
  target: string;
}

interface UpdateScoutingStatus {
  type: ScoutingTypeKeys.UPDATE_SCOUTING_STATUS;
  isActive: boolean;
}

export type ScoutingTypes =
  | SetScoutingTargetsAction
  | RemoveScoutingTarget
  | UpdateScoutingStatus;

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

export function removeScoutingTarget(target: string) {
  return {
    type: ScoutingTypeKeys.REOMVE_SCOUTING_TARGET,
    target
  };
}

export function updateScoutingStatus(isActive: boolean) {
  return {
    type: ScoutingTypeKeys.UPDATE_SCOUTING_STATUS,
    isActive
  };
}

export default {
  setScoutingTargets,
  removeScoutingTarget,
  updateScoutingStatus
};
