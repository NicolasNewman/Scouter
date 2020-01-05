import * as React from "react";
import { Component } from "react";

import DataForm from "./DataInputFormComponents/DataForm";
import {
  ScoutingTargets,
  SocketController
} from "../../../classes/socketController";

import { Tabs } from "antd";
import RequestHandler from "../../../classes/RequestHandler";
const { TabPane } = Tabs;

interface IProps {
  scoutingTargets: ScoutingTargets;
  matchNumber: number;
  socket: SocketController;
  requestHandler: RequestHandler;
  removeScoutingTarget: (target: string) => void;
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
                matchNumber={this.props.matchNumber}
                socket={this.props.socket}
                requestHandler={this.props.requestHandler}
                removeScoutingTarget={this.props.removeScoutingTarget}
              />
            </TabPane>
          ))}
        </Tabs>
      </div>
    );
  }
}
