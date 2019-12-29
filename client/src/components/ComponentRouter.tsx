import * as React from "react";
import { Component } from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./RouterComponents/Home";
import DataInput from "./RouterComponents/DataInput";
import Visualize from "./RouterComponents/Visualize";
import Admin from "./RouterComponents/Admin";
import ProtectedRoute from "../components/ProtectedRoute";
import RequestHandler from "../classes/RequestHandler";
import { SocketController, ScoutingTargets } from "../classes/socketController";
import {
  IAdminFormState,
  IAdminScoutStatus,
  MainTabKeys
} from "../reducers/admin";

interface IProps {
  isAdmin: boolean;
  requestHandler: RequestHandler;
  socket: SocketController;
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
}

export default class ComponentRouter extends Component<IProps> {
  props: IProps;

  constructor(props: IProps) {
    super(props);
  }

  render() {
    return (
      <div>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route
            path="/entry"
            component={() => (
              <DataInput
                scoutingTargets={this.props.scoutingTargets}
                matchNumber={this.props.matchNumber}
                socket={this.props.socket}
                requestHandler={this.props.requestHandler}
                removeScoutingTarget={this.props.removeScoutingTarget}
              />
            )}
          />
          <Route path="/visualize" component={Visualize} />
          {/* <Route path="/admin" component={Admin} /> */}
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
          <Route component={Home} />
        </Switch>
      </div>
    );
  }
}
