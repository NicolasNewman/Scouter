import * as React from "react";
import { Component } from "react";

import { Button } from "antd";

import {
  RobotEvents,
  Phase,
  IRobotEvent
} from "../../../../../../global/gameTypes";
import { IGridElementProps } from "../../../Grid/Grid";
import resolveScore from "../../../../../../global/scoreResolver";
import { IConstantProps } from "../DataInput";

interface IProps extends IGridElementProps {
  constants: IConstantProps;
  label: string;
  type: RobotEvents;
  phase: Phase;
  color?: string;
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
    return (
      <div
        style={{
          gridArea: this.props.gridAreaName
        }}
      >
        <Button
          style={{
            backgroundColor: this.props.color,
            borderColor: this.props.color
          }}
          onClick={this.clicked}
        >
          {this.props.label}
        </Button>
      </div>
    );
  }
}
