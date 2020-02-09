import * as React from "react";
import { Component } from "react";

import { Button } from "antd";

import { ERobotEvents, Phase, IRobotEvent } from "../../../../global/gameTypes";
import { IGridElementProps } from "../../../Grid/Grid";
import resolveScore from "../../../../../../global/scoreResolver";
import { IConstantProps } from "../DataInput";

interface IProps extends IGridElementProps {
  constants: IConstantProps;
  label: string;
  type: ERobotEvents;
  phase: Phase;
  color?: string;
  disabled?: boolean;
}

export default class AccuracyEventButton extends Component<IProps> {
  constructor(props: IProps) {
    super(props);
  }

  clicked = (success: 1 | 0) => {
    const points = resolveScore(this.props.type, this.props.phase);
    const event: IRobotEvent = {
      type: this.props.type,
      start: this.props.constants.getTime(),
      success
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
        <p
          style={{
            marginBottom: "5px"
          }}
        >
          {this.props.label}
        </p>
        <div
          style={{
            display: "flex",
            justifyContent: "center"
          }}
        >
          <Button
            style={{
              backgroundColor: "#00c06a",
              marginLeft: "2px",
              color: "#fff",
              width: "45%"
            }}
            onClick={this.clicked.bind(false)}
            disabled={this.props.disabled}
          >
            Hit
          </Button>
          <Button
            style={{
              backgroundColor: "#e60019",
              marginRight: "2px",
              width: "45%"
            }}
            onClick={this.clicked.bind(true)}
            disabled={this.props.disabled}
          >
            Miss
          </Button>
        </div>
      </div>
    );
  }
}
