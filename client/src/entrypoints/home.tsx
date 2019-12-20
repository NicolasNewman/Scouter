/**
 * In webpack terminology the 'entry point'
 * of the First SPA.
 */
import * as React from "react";
import { Component } from "react";
import * as ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Home from "../components/Home";
import DataInput from "../components/DataInput";
import Visualize from "../components/Visualize";
// import * as SPAs from "../../config/spa.config";
import NavContainer from "../containers/NavContainer";
import * as socketIOClient from "socket.io-client";
import "../app.global.less";

interface IProps {}

class Root extends Component<IProps> {
  props: IProps;

  constructor(props: IProps) {
    super(props);
  }

  componentDidMount() {
    const socket = socketIOClient("http://localhost:4000");
    console.log(socket);
  }

  render() {
    return (
      <div>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/entry" component={DataInput} />
          <Route path="/visualize" component={Visualize} />
          <Route component={Home} />
        </Switch>
      </div>
    );
  }
}

ReactDOM.render(
  <Router>
    <NavContainer rightComponent={Root} />
  </Router>,
  document.getElementById("react-root")
);
