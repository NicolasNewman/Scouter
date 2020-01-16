import * as React from "react";
import { Component } from "react";

// import DataForm from "./DataInputFormComponents/DataForm";
import {
  ScoutingTargets,
  SocketController,
  emitableEvents
} from "../../../classes/socketController";

import { Tabs } from "antd";
import RequestHandler from "../../../classes/RequestHandler";
// const { TabPane } = Tabs;

interface IProps {
  scoutingTargets: ScoutingTargets;
  matchNumber: number;
  socket: SocketController;
  requestHandler: RequestHandler;
  removeScoutingTarget: (target: string) => void;
  setMatchData: () => void;
}

interface IState {
  matchTime: number;
  phase: "NONE" | "AUTO" | "TELEOP" | "ENDGAME";
}

export default class Home extends Component<IProps, IState> {
  props: IProps;

  constructor(props: IProps) {
    super(props);

    this.state = {
      matchTime: 0,
      phase: "NONE"
    };

    setInterval(() => {
      this.props.socket.emit(
        emitableEvents.getRemainingTime,
        undefined,
        (remainingTime: number, phase: "AUTO" | "TELEOP" | "ENDGAME") => {
          this.setState({
            matchTime: remainingTime,
            phase
          });
        }
      );
    }, 500);
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
        <h1>Time Left: {this.state.matchTime}</h1>
        {/* <Tabs> // REWORK target removal
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
                setMatchData={this.props.setMatchData}
              />
            </TabPane>
          ))}
        </Tabs> */}
      </div>
    );
  }
}
