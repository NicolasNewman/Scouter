import * as React from "react";
import { Component } from "react";

import { Button } from "antd";

import {
  RobotStates,
  Phase,
  IRobotEvent
} from "../../../../../global/gameTypes";
import resolveScore from "../../../../../global/scoreResolver";
import { IConstantProps } from "./DataInput";

interface IProps {
  constants: IConstantProps;
  label: string;
  type: RobotStates;
  phase: Phase;
}

interface IState {
  started: boolean;
  state: {
    type: RobotStates;
    start?: number;
    end?: number;
  };
}

export default class RobotEventButton extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      started: false,
      state: {
        type: this.props.type
      }
    };
  }

  clicked = () => {
    if (!this.state.started) {
      this.setState({
        started: true,
        state: {
          type: this.state.state.type,
          start: this.props.constants.getTime()
        }
      });
    } else {
      this.setState({
        started: false,
        state: {
          type: this.state.state.type,
          start: this.state.state.start,
          end: this.props.constants.getTime()
        }
      });

      this.props.constants.handler.post(
        `matches/${this.props.constants.matchNumber}/${this.props.constants.teamNumber}/state`,
        this.state.state
      );
    }
  };

  render() {
    return (
      <Button
        style={this.state.started ? { color: "#e60019" } : { color: "#00c06a" }}
        onClick={this.clicked}
      >
        {this.props.label}
      </Button>
    );
  }
}
