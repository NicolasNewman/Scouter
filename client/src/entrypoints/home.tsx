/**
 * In webpack terminology the 'entry point'
 * of the First SPA.
 */
import * as React from "react";
import { Component } from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { ConnectedRouter } from "connected-react-router";
import { Route, Switch } from "react-router-dom";
import Home from "../components/Home";
import DataInput from "../components/DataInput";
import Visualize from "../components/Visualize";
// import * as SPAs from "../../config/spa.config";
import NavContainer from "../containers/NavContainer";
import "../app.global.less";
import { configureStore, history } from "../store/configureStore";

interface IProps {
  inputText: string;
}

interface IState {
  modalVisible: boolean;
  loggedIn: boolean;
  isAdmin: boolean;
  user: string | undefined;
}

class Root extends Component<IProps, IState> {
  props: IProps;

  constructor(props: IProps) {
    super(props);
    this.state = {
      modalVisible: true,
      loggedIn: false,
      isAdmin: false,
      user: undefined
    };
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
const store = configureStore();

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <NavContainer rightComponent={Root} />
    </ConnectedRouter>
  </Provider>,
  document.getElementById("react-root")
);
