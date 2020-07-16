import * as React from "react";
import { Component } from "react";

import { Button } from "antd";

import {
  ETeamEvents,
  EScorableTeamEvents,
  Phase,
  ITeamEvent,
} from "../../../../global/gameTypes";
import { IGridElementProps } from "../../../Grid/Grid";
import resolveScore from "../../../../../../global/scoreResolver";
import { IConstantProps } from "../DataInput";

interface IProps extends IGridElementProps {
  constants: IConstantProps;
  label: string;
  type: ETeamEvents | EScorableTeamEvents;
  phase: Phase;
  color?: string;
  disabled?: boolean;
}

export default class RobotTeamEventButton extends Component<IProps> {
  constructor(props: IProps) {
    super(props);
  }

  clicked = () => {
    const points = resolveScore(this.props.type, this.props.phase);
    const event: ITeamEvent = {
      type: this.props.type,
      start: this.props.constants.getTime()
    };
    if (points > 0) {
      event.points = points;
    }
    console.log(event);
    this.props.constants.handler.post(
      `games/${this.props.constants.matchNumber}/${this.props.constants.alliance}/event`,
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
