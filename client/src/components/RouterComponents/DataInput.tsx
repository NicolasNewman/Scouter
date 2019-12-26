import * as React from "react";
import { Component } from "react";

import { Tabs } from "antd";
const { TabPane } = Tabs;

interface IProps {
  scoutingTargets: Array<string>;
  matchNumber: number;
}

export default class Home extends Component<IProps> {
  props: IProps;

  constructor(props: IProps) {
    super(props);
  }

  render() {
    return (
      <div>
        <h1>You are scouting: {this.props.scoutingTargets}</h1>
        <h2>For match {this.props.matchNumber}</h2>
        <Tabs>
          {this.props.scoutingTargets.map(team => (
            <TabPane tab={team} key={team}>
              <h1>Insert form here</h1>
            </TabPane>
          ))}
        </Tabs>
      </div>
    );
  }
}
