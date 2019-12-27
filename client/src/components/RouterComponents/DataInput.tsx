import * as React from "react";
import { Component } from "react";

import DataForm from "../DataForm";

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
    if (this.props.scoutingTargets && this.props.matchNumber) {
      return (
        <div>
          <h1>Match: {this.props.matchNumber}</h1>
          <h1>Scouting: {this.props.scoutingTargets.join(", ")}</h1>
          <Tabs>
            {this.props.scoutingTargets.map(team => (
              <TabPane tab={team} key={team}>
                <DataForm team={team} />
              </TabPane>
            ))}
          </Tabs>
        </div>
      );
    } else {
      // return (
      //   <div>
      //     <h1>The scouting form isn't ready yet.</h1>
      //   </div>
      // );
      const matchNumber = 1;
      const scoutingTargets = ["100", "200", "300"];
      return (
        <div className="scouting">
          <h1>Match: {matchNumber}</h1>
          <h1>Scouting: {scoutingTargets.join(", ")}</h1>
          <Tabs>
            {scoutingTargets.map(team => (
              <TabPane tab={team} key={team + ""}>
                <DataForm team={team} />
              </TabPane>
            ))}
          </Tabs>
        </div>
      );
    }
  }
}
