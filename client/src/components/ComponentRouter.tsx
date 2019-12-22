import * as React from "react";
import { Component } from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./RouterComponents/Home";
import DataInput from "./RouterComponents/DataInput";
import Visualize from "./RouterComponents/Visualize";
import Admin from "./RouterComponents/Admin";
import ProtectedRoute from "../components/ProtectedRoute";

interface IProps {
  isAdmin: boolean;
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
          <Route path="/entry" component={DataInput} />
          <Route path="/visualize" component={Visualize} />
          {/* <Route path="/admin" component={Admin} /> */}
          <ProtectedRoute
            isAuthenticated={this.props.isAdmin}
            component={Admin}
            path="/admin"
          />
          <Route component={Home} />
        </Switch>
      </div>
    );
  }
}
