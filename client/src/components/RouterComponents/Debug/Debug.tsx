import * as React from "react";
import { Component } from "react";
import { Button, message } from "antd";

import RequestHandler from "../../../classes/RequestHandler";
import {
  SocketController,
  emitableEvents
} from "../../../classes/socketController";

// TEMP IMPORTS
import Grid from "../../Grid/Grid";
// import StateButton from "../DataInput/DataInputFormComponents/StateButton";
// import { IConstantProps } from "../DataInput/DataInput";
// import RobotEventButton from "../DataInput/DataInputFormComponents/RobotEventButton";
// import {
//   ScorableRobotEvents,
//   FoulEvents,
//   RobotStates
// } from "../../../../../global/gameTypes";

interface IProps {
  socket: SocketController;
  requestHandler: RequestHandler;
}

export default class Debug extends Component<IProps> {
  props: IProps;

  constructor(props: IProps) {
    super(props);
  }

  genTeams = () => {
    for (let i = 1; i <= 6; i++) {
      this.props.requestHandler
        .post("/teams", { teamNumber: i, teamName: "placeholder" })
        .then(_res => {
          message.success(`Team ${i} was successfully created`);
        })
        .catch(_err => {
          message.error(`Something went wrong. Is team ${i} already in use?`);
        });
    }
  };

  genUsers = () => {
    for (let i = 1; i <= 6; i++) {
      this.props.socket.emit(
        emitableEvents.registerUser,
        `P${i}`,
        isNameTaken => {
          if (isNameTaken) {
            message.error("That name is already taken");
          }
        }
      );
    }
  };

  render() {
    return (
      <div>
        <h1>DEBUGGING CONTROL PANEL</h1>
        <Button type="default" onClick={this.genTeams}>
          Prefill Teams
        </Button>
        <Button type="default" onClick={this.genUsers}>
          Generate Fake Users
        </Button>
        <div className="scouting">
          <h1>Match: 10</h1>
          <h1>Scouting: 4500</h1>
          <h1>Phase</h1>
          <h1>Time Left: 10</h1>
        </div>
        <Grid
          className="dashboard"
          templateArea="
          'time phase'
          'match team'"
          rows="1fr 1fr"
          cols="1fr 1fr"
          gridElements={[
            <h1 style={{ gridArea: "time" }}>Time: 30s</h1>,
            <h1 style={{ gridArea: "phase" }}>Phase: Auto</h1>,
            <h2 style={{ gridArea: "match" }}>Match: 10</h2>,
            <h2 style={{ gridArea: "team" }}>Team: 4500</h2>
          ]}
        />
      </div>
    );
  }
}
