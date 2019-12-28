import * as React from "react";
import { Component } from "react";

import DataForm from "../DataForm";
import {
  ScoutingTargets,
  SocketController
} from "../../classes/socketController";

import { Tabs } from "antd";
const { TabPane } = Tabs;

interface IProps {
  scoutingTargets: ScoutingTargets;
  matchNumber: number;
  socket: SocketController;
}

export default class Home extends Component<IProps> {
  props: IProps;

  constructor(props: IProps) {
    super(props);
  }

  render() {
    const scoutingTargets = this.props.scoutingTargets
      .map(obj => {
        return obj.team;
      })
      .join(", ");
    if (this.props.scoutingTargets && this.props.matchNumber) {
      return (
        <div className="scouting">
          <h1>Match: {this.props.matchNumber}</h1>
          <h1>Scouting: {scoutingTargets}</h1>
          <Tabs>
            {this.props.scoutingTargets.map(target => (
              <TabPane tab={target.team} key={target.team}>
                <DataForm
                  team={target.team}
                  alliance={target.alliance}
                  seed={target.seed}
                  socket={this.props.socket}
                />
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
                <DataForm alliance="red" seed="s1" team={team} />
              </TabPane>
            ))}
          </Tabs>
        </div>
      );
    }
  }
}
