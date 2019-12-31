import { createHashHistory } from "history";
import { connectRouter, routerMiddleware } from "connected-react-router";
import { createStore, applyMiddleware, compose, combineReducers } from "redux";
import thunk from "redux-thunk";

import user from "../reducers/user";
import admin from "../reducers/admin";
import scouting from "../reducers/scouting";
import data from "../reducers/data";

const history = createHashHistory();
const rootReducer = combineReducers({
  router: connectRouter(history),
  user,
  admin,
  scouting,
  data
});

const configureStore = (initialState?: any) => {
  const middleware = [];
  const enhancers = [];

  middleware.push(thunk);

  const router = routerMiddleware(history);
  middleware.push(router);

  enhancers.push(applyMiddleware(...middleware));
  const enhancer = compose(...enhancers);

  const store = createStore(rootReducer, initialState, enhancer as any);

  return store;
};

export { configureStore, history };
