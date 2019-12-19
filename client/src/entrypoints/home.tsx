/**
 * In webpack terminology the 'entry point'
 * of the First SPA.
 */
import * as React from "react";
import { Component } from "react";
import * as ReactDOM from "react-dom";
import { Helmet } from "react-helmet";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import HomeContainer from "../containers/HomeContainer";
import DataInputContainer from "../containers/DataInputContainer";
import * as SPAs from "../../config/spa.config";
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
      <Router>
        <div>
          <Switch>
            <Route exact path="/" component={HomeContainer} />
            <Route path="/entry" component={DataInputContainer} />
            <Route component={HomeContainer} />
          </Switch>
        </div>
      </Router>
    );
  }
}

ReactDOM.render(<Root />, document.getElementById("react-root"));
