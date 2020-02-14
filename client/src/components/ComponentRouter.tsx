import * as React from "react";
import { Component } from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./RouterComponents/Home";
import DataInput from "./RouterComponents/DataInput/DataInput";
import Visualize from "./RouterComponents/Visualize/Visualize";
import Admin from "./RouterComponents/Admin/Admin";
import Debug from "./RouterComponents/Debug/Debug";
import ProtectedRoute from "../components/ProtectedRoute";
import RequestHandler from "../classes/RequestHandler";
import { SocketController, ScoutingTargets } from "../classes/socketController";
import {
  IAdminFormState,
  IAdminScoutStatus,
  MainTabKeys
} from "../reducers/admin";
import { IGame, ITeam } from "../global/modelTypes";
import { History } from "history";

interface IProps {
  requestHandler: RequestHandler;
  isAdmin: boolean;
  socket: SocketController;
  history: History;
  formState: IAdminFormState;
  scoutStatus: IAdminScoutStatus;
  inProgress: boolean;
  removeScoutingTarget: (target: string) => void;
  keyOfSelectedMainTab: MainTabKeys;
  setFormState: (state: IAdminFormState) => void;
  setFormField: (field: string, value: string) => void;
  startSession: () => void;
  endSession: () => void;
  setSelectedMainTab: (key: MainTabKeys) => void;
  scoutingTargets: ScoutingTargets;
  matchNumber: number;
  teamData: Array<ITeam>;
  gameData: Array<IGame>;
  setMatchData: () => void;
}

/**
 * Component used to map the router's path to the corrosponding component
 *
 * The path is generally set through the Navigation component
 */
export default class ComponentRouter extends Component<IProps> {
  props: IProps;

  constructor(props: IProps) {
    super(props);
    console.log(this.props);
  }

  render() {
    return (
      <div>
        <Switch>
          <Route
            exact
            path="/"
            component={() => <Home isAdmin={this.props.isAdmin} />}
          />
          <Route
            path="/entry"
            component={() => (
              <DataInput
                scoutingTargets={this.props.scoutingTargets}
                matchNumber={this.props.matchNumber}
                socket={this.props.socket}
                requestHandler={this.props.requestHandler}
                removeScoutingTarget={this.props.removeScoutingTarget}
                setMatchData={this.props.setMatchData}
              />
            )}
          />
          <Route
            path="/visualize"
            component={() => (
              <Visualize
                history={this.props.history}
                teamData={this.props.teamData}
                gameData={this.props.gameData}
              />
            )}
          />
          <ProtectedRoute
            isAuthenticated={this.props.isAdmin}
            component={() => (
              <Admin
                socket={this.props.socket}
                requestHandler={this.props.requestHandler}
                formState={this.props.formState}
                scoutStatus={this.props.scoutStatus}
                inProgress={this.props.inProgress}
                keyOfSelectedMainTab={this.props.keyOfSelectedMainTab}
                setFormState={this.props.setFormState}
                setFormField={this.props.setFormField}
                startSession={this.props.startSession}
                endSession={this.props.endSession}
                setSelectedMainTab={this.props.setSelectedMainTab}
              />
            )}
            path="/admin"
          />
          <Route
            path="/debug"
            component={() => (
              <Debug
                socket={this.props.socket}
                requestHandler={this.props.requestHandler}
              />
            )}
          ></Route>
          <Route component={Home} />
        </Switch>
      </div>
    );
  }
}
