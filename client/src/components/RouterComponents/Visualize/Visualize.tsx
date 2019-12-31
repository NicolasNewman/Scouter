import * as React from "react";
import { Component } from "react";
import { IStatisticData, IMatch } from "../../../reducers/data";
import { keys, isEmpty } from "../../../helper/helper";
import Barchart from "./PlotComponents/Barchart";
import Scatterplot from "./PlotComponents/Scatterplot";
import { History } from "history";

import { Tabs, Select, Radio } from "antd";
const Option = Select;
const { TabPane } = Tabs;

interface IProps {
  history: History;
  teamMins: IStatisticData;
  teamMaxes: IStatisticData;
  teamAverages: IStatisticData;
}

export enum BarChartModes {
  FIELD = "fields",
  TEAM = "teams"
}

export type Statistic = "min" | "max" | "avg";

type StatisticToData = {
  [key in Statistic]: IStatisticData;
};

interface IState {
  barChartMode: BarChartModes;
  barTraces: Array<string>;
  barStatistic: Statistic;
  ejected: boolean;
}

export default class Home extends Component<IProps, IState> {
  props: IProps;
  teams: Array<string>;
  fields: Array<keyof IMatch>;
  statToData: StatisticToData;

  constructor(props: IProps) {
    super(props);
    console.log(this.props.teamMaxes);
    console.log(this.props.teamMins);
    console.log(this.props.teamAverages);
    if (
      isEmpty(this.props.teamAverages) ||
      isEmpty(this.props.teamMaxes) ||
      isEmpty(this.props.teamMins)
    ) {
      this.props.history.push("/");
      this.state = {
        ejected: true
      };
    } else {
      this.teams = Object.keys(this.props.teamMaxes);
      this.fields = keys(this.props.teamMaxes[this.teams[0]]);

      console.log(`Teams are ${this.teams}`);
      console.log(`Fields are ${this.fields}`);

      this.statToData = {
        min: this.props.teamMins,
        max: this.props.teamMaxes,
        avg: this.props.teamAverages
      };

      this.state = {
        barChartMode: BarChartModes.FIELD,
        barTraces: [],
        barStatistic: "min",
        ejected: false
      };
    }
  }

  barTraceSelectChanged = (values: any) => {
    this.setState({ barTraces: values });
  };

  barStatisticChanged = (value: any) => {
    this.setState({ barStatistic: value });
  };

  componentDidUpdate() {}

  render() {
    if (!this.state.ejected) {
      return (
        <div>
          <Tabs>
            <TabPane tab="Barchart" key="barchart">
              <Radio.Group defaultValue={this.state.barChartMode}>
                <Radio value={BarChartModes.FIELD}>
                  Compare all fields of a statistic for a multiple teams
                </Radio>
                <Radio value={BarChartModes.TEAM}>
                  Compare all teams to multiple fields of a statistic
                </Radio>
              </Radio.Group>
              {this.state.barChartMode === BarChartModes.FIELD ? (
                // Mode is FIELD
                <div>
                  <p>Fields: </p>
                  <Select mode="multiple" onChange={this.barTraceSelectChanged}>
                    {this.fields.map(field => (
                      <Option key={field}>{field}</Option>
                    ))}
                  </Select>
                </div>
              ) : (
                // Mode is TEAM
                <div>
                  <p>Teams: </p>
                  <Select mode="multiple" onChange={this.barTraceSelectChanged}>
                    {this.teams.map(team => (
                      <Option key={team}>{team}</Option>
                    ))}
                  </Select>
                </div>
              )}
              <Select onChange={this.barStatisticChanged}>
                <Option key={"avg"}>Average</Option>
                <Option key={"max"}>Maximum</Option>
                <Option key={"min"}>Minimum</Option>
              </Select>
              {/* <Barchart
              statistic={this.state.barStatistic}
              traces={this.state.barTraces}
              data={this.statToData[this.state.barStatistic]}
              mode={this.state.barChartMode}
              fields={this.fields}
              teams={this.teams}
            /> */}
            </TabPane>
            <TabPane tab="Scatterplot" key="scatterplot">
              <Tabs>
                <TabPane tab="Compare fields" key="fields"></TabPane>
                <TabPane tab="Compare stats" key="stats"></TabPane>
              </Tabs>
            </TabPane>
          </Tabs>
        </div>
      );
    } else {
      return <p>Something went wrong, please go back to home</p>;
    }
  }
}
