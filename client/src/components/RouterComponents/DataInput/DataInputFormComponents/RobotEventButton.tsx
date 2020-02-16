import * as React from "react";
import { Component } from "react";

import { Button } from "antd";

import {
  ERobotEvents,
  EScorableRobotEvents,
  Phase,
  IRobotEvent,
  EFoulEvents
} from "../../../../global/gameTypes";
import { IGridElementProps } from "../../../Grid/Grid";
import resolveScore from "../../../../../../global/scoreResolver";
import { IConstantProps } from "../DataInput";

interface IProps extends IGridElementProps {
  constants: IConstantProps;
  label: string;
  type: ERobotEvents | EScorableRobotEvents | EFoulEvents;
  phase: Phase;
  color?: string;
  disabled?: boolean;
}

export default class RobotEventButton extends Component<IProps> {
  constructor(props: IProps) {
    super(props);
  }

  clicked = () => {
    const points = resolveScore(this.props.type, this.props.phase);
    const event: IRobotEvent = {
      type: this.props.type,
      start: this.props.constants.getTime()
    };
    if (points > 0) {
      event.points = points;
    }
    console.log(event);
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
          disabled={this.props.disabled}
        >
          {this.props.label}
        </Button>
      </div>
    );
  }
}
