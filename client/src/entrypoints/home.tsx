/**
 * In webpack terminology the 'entry point'
 * of the First SPA.
 */
import * as React from "react";
import { Component } from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { ConnectedRouter } from "connected-react-router";
// import * as SPAs from "../../config/spa.config";
import NavContainer from "../containers/NavContainer";
import "../app.global.less";
import { configureStore, history } from "../store/configureStore";
import { SocketController } from "../socket/socketController";

const store = configureStore();
const socket = new SocketController("http://localhost:4000");

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <NavContainer socket={socket} />
    </ConnectedRouter>
  </Provider>,
  document.getElementById("react-root")
);

export default store;
