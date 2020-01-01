import * as React from "react";
import { Route, Redirect } from "react-router-dom";

interface IProps {
  component: React.ReactType;
  isAuthenticated: boolean;
  path: string;
}
/**
 * A route that requires a flag to be true in order to render the component
 * @param component - component to render if the flag is true
 * @param isAuthenticated - flag to determine if to allow access to the route
 */
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
