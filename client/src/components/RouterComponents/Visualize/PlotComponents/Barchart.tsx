import * as React from "react";
import { Component } from "react";
import Plot from "react-plotly.js";
import { Statistic, BarChartModes } from "../Visualize";
import { IStatisticData, IMatch } from "../../../../reducers/data";

interface IProps {
  statistic: Statistic;
  traces: Array<string>;
  data: IStatisticData;
  mode: BarChartModes;
  fields: Array<keyof IMatch>;
  teams: Array<string>;
}

export default class Barchart extends Component<IProps> {
  props: IProps;
  traces: any;

  constructor(props: IProps) {
    super(props);

    // data[team][field];
    if (this.props.mode === BarChartModes.FIELD) {
      this.traces = this.props.traces.map(traceName => {
        const xLabels = this.props.fields;
        let yData: Array<number> = [];

        this.props.fields.forEach(field => {
          yData.push(this.props.data[traceName][field]);
        });

        return {
          x: xLabels,
          y: yData,
          name: traceName,
          type: "bar"
        };
      });
    } else {
      this.traces = this.props.traces.map((traceName: keyof IMatch) => {
        const xLabels = this.props.teams;
        let yData: Array<number> = [];

        this.props.teams.forEach(team => {
          yData.push(this.props.data[team][traceName]);
        });

        return {
          x: xLabels,
          y: yData,
          name: traceName,
          type: "bar"
        };
      });
    }
  }
  render() {
    return (
      <div>
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
