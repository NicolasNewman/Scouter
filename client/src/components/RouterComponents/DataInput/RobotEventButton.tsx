import * as React from "react";
import { Component } from "react";

import { Button } from "antd";

import RequestHandler from "../../../classes/RequestHandler";
import {
  RobotEvents,
  Phase,
  IRobotEvent
} from "../../../../../global/gameTypes";
import resolveScore from "../../../../../global/scoreResolver";

interface IProps {
  label: string;
  handler: RequestHandler;
  type: RobotEvents;
  phase: Phase;
  time: number;
  matchNumber: number;
  teamNumber: number;
}

export default class RobotEventButton extends Component<IProps> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      state: {
        type: this.props.type
      }
    };
  }

  clicked = () => {
    const score = resolveScore(this.props.type, this.props.phase);
    const event: IRobotEvent = {
      type: this.props.type,
      start: this.props.time
    };
    if (score > 0) {
      event.score = score;
    }

    this.props.handler.post(
      `matches/${this.props.matchNumber}/${this.props.teamNumber}/event`,
      event
    );
  };

  render() {
    return <Button onClick={this.clicked}>{this.props.label}</Button>;
  }
}
