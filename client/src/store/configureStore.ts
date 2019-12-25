import { createHashHistory } from "history";
import { connectRouter, routerMiddleware } from "connected-react-router";
import { createStore, applyMiddleware, compose, combineReducers } from "redux";

import user from "../reducers/user";
import admin from "../reducers/admin";
import scouting from "../reducers/scouting";

const history = createHashHistory();
const rootReducer = combineReducers({
  router: connectRouter(history),
  user,
  admin,
  scouting
});

const configureStore = (initialState?: any) => {
  const middleware = [];
  const enhancers = [];

  const router = routerMiddleware(history);
  middleware.push(router);

  enhancers.push(applyMiddleware(...middleware));
  const enhancer = compose(...enhancers);

  const store = createStore(rootReducer, initialState, enhancer as any);

  return store;
};

export { configureStore, history };
