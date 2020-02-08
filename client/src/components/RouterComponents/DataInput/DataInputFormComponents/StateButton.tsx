import * as React from "react";
import { Component } from "react";

import { Button } from "antd";

import { IGridElementProps } from "../../../Grid/Grid";
import { RobotStates, Phase } from "../../../../../../global/gameTypes";
import { IConstantProps } from "../DataInput";

interface IProps extends IGridElementProps {
  constants: IConstantProps;
  label: string;
  type: RobotStates;
  phase: Phase;
  disabled?: boolean;
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

  componentDidUpdate(_prevProps: IProps, prevState: IState) {
    if (prevState.started && !this.state.started) {
      this.props.constants.handler.post(
        `matches/${this.props.constants.matchNumber}/${this.props.constants.teamNumber}/state`,
        this.state.state
      );
    }
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
      // console.log(`The sent state is:`);

      // this.props.constants.handler.post(
      //   `matches/${this.props.constants.matchNumber}/${this.props.constants.teamNumber}/state`,
      //   this.state.state
      // );
    }
  };

  render() {
    return (
      <div
        style={{
          gridArea: this.props.gridAreaName
        }}
      >
        <Button
          style={
            this.state.started
              ? { backgroundColor: "#e60019" }
              : { backgroundColor: "#00c06a" }
          }
          onClick={this.clicked}
          type="primary"
          disabled={this.props.disabled}
        >
          {this.props.label}
        </Button>
      </div>
    );
  }
}
