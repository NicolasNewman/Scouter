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
import { IAdminFormState } from "../reducers/admin";

interface IProps {
  isAdmin: boolean;
  requestHandler: RequestHandler;
  socket: SocketController;
  formState: IAdminFormState;
  setFormState: (state: IAdminFormState) => void;
  setFormField: (field: string, value: string) => void;
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
                setFormState={this.props.setFormState}
                setFormField={this.props.setFormField}
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
