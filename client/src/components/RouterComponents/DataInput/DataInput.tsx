import * as React from "react";
import { Component } from "react";

// import DataForm from "./DataInputFormComponents/DataForm";
import {
  ScoutingTargets,
  SocketController,
  emitableEvents
} from "../../../classes/socketController";

import RobotEventButton from "./RobotEventButton";
import StateButton from "./StateButton";
import {
  ScorableRobotEvents,
  RobotStates
} from "../../../../../global/gameTypes";

// import { Tabs } from "antd";
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

export interface IConstantProps {
  handler: RequestHandler;
  getTime: () => number;
  matchNumber: number;
  teamNumber: number;
}

interface IState {
  matchTime: number;
  phase: "NONE" | "AUTO" | "TELEOP" | "ENDGAME";
}

export default class Home extends Component<IProps, IState> {
  props: IProps;
  constantProps: IConstantProps;

  constructor(props: IProps) {
    super(props);

    this.state = {
      matchTime: 0,
      phase: "NONE"
    };

    this.constantProps = {
      handler: this.props.requestHandler,
      getTime: this.getTime,
      matchNumber: this.props.matchNumber,
      teamNumber: parseInt(this.props.scoutingTargets[0].team)
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

  getTime = (): number => {
    return this.state.matchTime;
  };

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

        <RobotEventButton
          constants={this.constantProps}
          label="event"
          type={ScorableRobotEvents.POSITION_CONTROL}
          phase={this.state.phase === "NONE" ? "AUTO" : this.state.phase}
        />
        <StateButton
          constants={this.constantProps}
          label="state"
          type={RobotStates.DEFENDING}
          phase={this.state.phase === "NONE" ? "AUTO" : this.state.phase}
        />
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
