import * as React from "react";
import { Component } from "react";
import { Button, message } from "antd";

import RequestHandler from "../../../classes/RequestHandler";
import {
  ScoutingTargets,
  SocketController,
  emitableEvents
} from "../../../classes/socketController";

interface IProps {
  socket: SocketController;
  requestHandler: RequestHandler;
}

export default class Debug extends Component<IProps> {
  props: IProps;

  constructor(props: IProps) {
    super(props);
  }

  genTeams = () => {};

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
      </div>
    );
  }
}
