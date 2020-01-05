import * as React from "react";
import { Component } from "react";
import Plot from "react-plotly.js";
import { IStatisticData } from "../../../../reducers/data";

import { Select } from "antd";
const Option = Select;

interface IProps {
  teamMins: IStatisticData;
  teamMaxes: IStatisticData;
  teamAverages: IStatisticData;
}

interface IState {}

type CompiledData = {
  min: Array<number>;
  max: Array<number>;
  avg: Array<number>;
  labels: Array<string>;
};

export default class Scatterplot extends Component<IProps, IState> {
  props: IProps;
  compiledData: CompiledData;
  // teams: Array<string>;

  constructor(props: IProps) {
    super(props);
    this.state = {
      xSelector: "min",
      ySelector: "max",
      data: {
        x: [],
        y: [],
        label: []
      }
    };

    // this.keyToData = {
    //   min: this.props.teamMins,
    //   max: this.props.teamMaxes,
    //   avg: this.props.teamAverages
    // };
  }

  xSelectChanged = (value: any) => {
    this.setState({ xSelector: value.key });
  };

  ySelectChanged = (value: any) => {
    this.setState({ ySelector: value.key });
  };
  render() {
    return (
      <div>
        <div>
          <Select onChange={this.xSelectChanged}>
            <Option key="min">Mins</Option>
            <Option key="max">Maxes</Option>
            <Option key="avg">Averages</Option>
          </Select>
          <Select onChange={this.ySelectChanged}>
            <Option key="min">Mins</Option>
            <Option key="max">Maxes</Option>
            <Option key="avg">Averages</Option>
          </Select>
        </div>
        <Plot
          data={[
            {
              x: [1, 2, 3, 4],
              y: [1, 2, 3, 4],
              mode: "markers",
              type: "scatter"
            }
          ]}
          layout={{
            width: 960,
            height: 540,
            title: "A Fancy Plot"
          }}
        />
      </div>
    );
  }
}
