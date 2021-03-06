import { bindActionCreators, Dispatch } from "redux";
import { connect } from "react-redux";

import UserActions from "../actions/user";
import AdminActions from "../actions/admin";
import ScoutingActions from "../actions/scouting";
import DataActions from "../actions/data";

import Root from "../components/Root";

function mapStateToProps(state: any, _ownProps: any) {
  console.log(state);
  return {
    username: state.user.username,
    isAdmin: state.user.isAdmin,
    isAuthenticated: state.user.isAuthenticated,
    formState: state.admin.formState,
    scoutStatus: state.admin.scoutStatus,
    inProgress: state.admin.inProgress,
    keyOfSelectedMainTab: state.admin.keyOfSelectedMainTab,
    scoutingTargets: state.scouting.targets,
    matchNumber: state.scouting.matchNumber,
    isActive: state.scouting.isActive,
    teamData: state.data.teamData,
    gameData: state.data.gameData
  };
}

function mapDispatchToDrops(dispatch: Dispatch) {
  return bindActionCreators(
    {
      ...UserActions,
      ...AdminActions,
      ...ScoutingActions,
      ...DataActions
    },
    dispatch
  );
}

/**
 * Maps the redux store props to the Root component
 */
export default connect(mapStateToProps, mapDispatchToDrops)(Root);
