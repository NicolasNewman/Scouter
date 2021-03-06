import * as React from "react";
import * as ReactDOM from "react-dom";
import { Helmet } from "react-helmet";
import * as SPAs from "../../config/spa.config";
import "../app.global.less";

ReactDOM.render(
  <>
    <Helmet title={SPAs.appTitle} />
    <div
      style={{ textAlign: "center", marginTop: "2rem", marginBottom: "3rem" }}
    >
      <h2>Welcome to {SPAs.appTitle}</h2>
    </div>
    {/* <ComponentC /> */}
  </>,
  document.getElementById("react-root")
);
