import * as React from "react";
import { Component } from "react";
import Plot from "react-plotly.js";
import { IVirtualizedMatch } from "../../../../global/modelTypes";
import { gameProperties } from "../../../../global/gameTypes";

import { Select } from "antd";
import { PlotData } from "plotly.js";
const Option = Select;

interface IProps {
  match: IVirtualizedMatch;
}

interface IState {}

export default class Timeline extends Component<IProps, IState> {
  props: IProps;
  colorArray: Array<string> = [
    "#1f77b4",
    "#ff7f0e",
    "#2ca02c",
    "#d62728",
    "#9467bd",
    "#8c564b",
    "#e377c2",
    "#7f7f7f",
    "#bcbd22",
    "#17becf"
  ];
  // teams: Array<string>;

  constructor(props: IProps) {
    super(props);
    console.log(this.props.match);
    this.state = {};
  }

  render() {
    const traces: Array<Partial<PlotData>> = [];
    const yIndxMap: { [key: string]: number } = {};
    let traceColorMap: { [key: string]: string } = {};
    let i = 1;

    if (this.props.match.robotStates) {
      this.props.match.robotStates.forEach(state => {
        if (state.start && state.end) {
          const typeStr = state.type.toString();
          let firstOccurence = false;
          if (!yIndxMap[typeStr]) {
            yIndxMap[typeStr] = i;
            traceColorMap[typeStr] = this.colorArray[(i - 1) % 10];
            i++;
            firstOccurence = true;
          }
          traces.push({
            x: [state.start, state.end],
            y: [yIndxMap[typeStr], yIndxMap[typeStr]],
            mode: "lines",
            type: "scatter",
            showlegend: firstOccurence,
            legendgroup: typeStr,
            name: typeStr,
            line: {
              color: traceColorMap[typeStr],
              width: 10
            }
          });
        }
      });
    }
    i += 1;
    let j = 0;
    const occuredTypes: Array<string> = [];
    traceColorMap = {};

    if (this.props.match.robotEvents) {
      this.props.match.robotEvents.forEach(event => {
        const typeStr = event.type.toString();
        let firstOccurence = false;
        if (!traceColorMap[typeStr]) {
          traceColorMap[typeStr] = this.colorArray[j % 10];
          firstOccurence = true;
          j++;
        }
        if (event.success != undefined) {
          traces.push({
            x: [event.start],
            y: [i],
            mode: "markers",
            type: "scatter",
            showlegend: firstOccurence,
            legendgroup: typeStr,
            name: typeStr,
            marker: {
              color: event.success > 0 ? "#00ff00" : "#ff0000",
              size: 10
            }
          });
        } else {
          traces.push({
            x: [event.start],
            y: [i],
            mode: "markers",
            type: "scatter",
            legendgroup: typeStr,
            name: typeStr,
            marker: {
              color: traceColorMap[typeStr],
              size: 10
            }
          });
        }
      });
    }

    return (
      <div>
        <div></div>
        <Plot
          data={[...traces]}
          layout={{
            height: 250,
            xaxis: {
              range: [gameProperties.matchDuration, 0],
              rangemode: "tozero",
              tickmode: "linear",
              fixedrange: true,
              dtick: 10
            },
            yaxis: {
              range: [0, i + 1],
              fixedrange: true,
              dtick: 1
            },
            title: `Team ${this.props.match.teamNumber}`
          }}
        />
      </div>
    );
  }
}
