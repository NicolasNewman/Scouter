import * as React from "react";
import { Component } from "react";

import { Button } from "antd";

import {
  RobotEvents,
  Phase,
  IRobotEvent
} from "../../../../../../global/gameTypes";
import resolveScore from "../../../../../../global/scoreResolver";
import { IConstantProps } from "../DataInput";

interface IProps {
  constants: IConstantProps;
  label: string;
  type: RobotEvents;
  phase: Phase;
}

export default class RobotEventButton extends Component<IProps> {
  constructor(props: IProps) {
    super(props);
  }

  clicked = () => {
    const score = resolveScore(this.props.type, this.props.phase);
    const event: IRobotEvent = {
      type: this.props.type,
      start: this.props.constants.getTime()
    };
    if (score > 0) {
      event.score = score;
    }

    this.props.constants.handler.post(
      `matches/${this.props.constants.matchNumber}/${this.props.constants.teamNumber}/event`,
      event
    );
  };

  render() {
    return <Button onClick={this.clicked}>{this.props.label}</Button>;
  }
}
