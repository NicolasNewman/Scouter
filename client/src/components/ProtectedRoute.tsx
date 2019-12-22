import * as React from "react";
// const { Component } = React;
import { Route, Redirect } from "react-router-dom";

interface IProps {
  component: React.ReactType;
  isAuthenticated: boolean;
  path: string;
}

const ProtectedRoute: React.FC<IProps> = ({
  component: Component,
  isAuthenticated,
  path,
  ...rest
}) => {
  return (
    <Route
      path={path}
      {...rest}
      render={props => {
        if (isAuthenticated) {
          return <Component {...props} />;
        } else {
          return (
            <Redirect to={{ pathname: "/", state: { from: props.location } }} />
          );
        }
      }}
    />
  );
};

export default ProtectedRoute;