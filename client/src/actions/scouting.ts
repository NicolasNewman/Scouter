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

/**
 * Sets the targets that the scout should be scouting.
 *
 * This is generally called from the socket
 * @param targets - a list of the team numbers that the scout is scouting
 * @param matchNumber - the number of the current match
 */
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

/**
 * @deprecated Left over from when the data input was form based
 *
 * Removes a team from the list of targets. This is generally done to clear the form once it is submited
 * @param target - the team to remove from the list of targets
 */
export function removeScoutingTarget(target: string) {
  return {
    type: ScoutingTypeKeys.REOMVE_SCOUTING_TARGET,
    target
  };
}

/**
 * Updates the flag for if the scout is currently scouting
 * @deprecated
 */
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
