import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { ConnectedRouter } from "connected-react-router";
import Root from "../containers/RootContainer";
import { configureStore, history } from "../store/configureStore";
import { SocketController } from "../classes/socketController";
import RequestHandler from "../classes/RequestHandler";
import * as constants from "../constants/constants.json";

import "../app.global.less";

const store = configureStore();
const socket = new SocketController(constants.socketRoute);
const requestHandler = new RequestHandler(constants.apiRoute);

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <Root socket={socket} requestHandler={requestHandler} />
    </ConnectedRouter>
  </Provider>,
  document.getElementById("react-root")
);

export default store;
