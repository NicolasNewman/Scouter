import * as React from "react";
import { Component } from "react";

import Plot from "react-plotly.js";

interface IProps {}

export default class App extends Component<IProps> {
  props: IProps;

  constructor(props: IProps) {
    super(props);
  }
  render() {
    return (
      <div>
        <Plot
          data={[]}
          layout={{ width: 320, height: 240, title: "A Fancy Plot" }}
        />
      </div>
    );
  }
}
