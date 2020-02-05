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
import StateButton from "../DataInput/DataInputFormComponents/StateButton";
import { IConstantProps } from "../DataInput/DataInput";
import RobotEventButton from "../DataInput/DataInputFormComponents/RobotEventButton";
import {
  ScorableRobotEvents,
  FoulEvents,
  RobotStates
} from "../../../../../global/gameTypes";

interface IProps {
  socket: SocketController;
  requestHandler: RequestHandler;
}

export default class Debug extends Component<IProps> {
  props: IProps;
  constantProps: IConstantProps;

  constructor(props: IProps) {
    super(props);
    this.constantProps = {
      handler: this.props.requestHandler,
      getTime: () => {
        return 2;
      },
      matchNumber: 2,
      teamNumber: 4500
    };
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
        <Grid
          className="input-grid"
          cols="20% 40% 40%"
          rows="1fr 1fr"
          templateArea="
          'multi-event single-event  state' 
          'multi-event  foul-event   state'"
          gridElements={[
            <Grid
              className="input-grid__child"
              gridAreaName="multi-event"
              cols="1fr"
              rows="10% 30% 30% 30%"
              templateArea="
              'title'
              'inner'
              'outer'
              'bottom'"
              gridElements={[
                <div className="input-grid__title">
                  <p>Powercells</p>
                </div>,
                <RobotEventButton
                  gridAreaName="inner"
                  constants={this.constantProps}
                  label="Inner"
                  type={ScorableRobotEvents.POWERCELLS_INNER}
                  phase="AUTO"
                />,
                <RobotEventButton
                  gridAreaName="outer"
                  constants={this.constantProps}
                  label="Outer"
                  type={ScorableRobotEvents.POWERCELLS_OUTER}
                  phase="AUTO"
                />,
                <RobotEventButton
                  gridAreaName="bottom"
                  constants={this.constantProps}
                  label="Bottom "
                  type={ScorableRobotEvents.POWERCELLS_BOTTOM}
                  phase="AUTO"
                />
              ]}
            />,
            <Grid
              className="input-grid__child"
              gridAreaName="foul-event"
              cols="1fr 1fr"
              rows="20% 40% 40%"
              templateArea="
              'title title'
              'foul tech'
              'yellow red'"
              gridElements={[
                <div className="input-grid__title">
                  <p>Fouls</p>
                </div>,
                <RobotEventButton
                  gridAreaName="foul"
                  constants={this.constantProps}
                  label="Foul"
                  type={FoulEvents.FOUL}
                  phase="AUTO"
                />,
                <RobotEventButton
                  gridAreaName="tech"
                  constants={this.constantProps}
                  label="Tech Foul"
                  type={FoulEvents.TECH_FOUL}
                  phase="AUTO"
                />,
                <RobotEventButton
                  gridAreaName="yellow"
                  constants={this.constantProps}
                  label="Yellow Card"
                  type={FoulEvents.YELLOW_CARD}
                  phase="AUTO"
                />,
                <RobotEventButton
                  gridAreaName="red"
                  constants={this.constantProps}
                  label="Red Card"
                  type={FoulEvents.RED_CARD}
                  phase="AUTO"
                />
              ]}
            />,
            <Grid
              className="input-grid__child"
              gridAreaName="state"
              cols="1fr 1fr"
              rows="10% 30% 30% 30%"
              templateArea="
              'title      title   '
              'gather     shooting'
              'wheel      climbing'
              'defending      .   '"
              gridElements={[
                <div className="input-grid__title">
                  <p>States</p>
                </div>,

                <StateButton
                  gridAreaName="wheel"
                  constants={this.constantProps}
                  label="Wheel"
                  type={RobotStates.WHEEL}
                  phase="AUTO"
                />,
                <StateButton
                  gridAreaName="shooting"
                  constants={this.constantProps}
                  label="Shooting"
                  type={RobotStates.SHOOTING}
                  phase="AUTO"
                />,
                <StateButton
                  gridAreaName="gather"
                  constants={this.constantProps}
                  label="Gathering"
                  type={RobotStates.GATHERING}
                  phase="AUTO"
                />,
                <StateButton
                  gridAreaName="climbing"
                  constants={this.constantProps}
                  label="Climbing"
                  type={RobotStates.CLIMBING}
                  phase="AUTO"
                />,
                <StateButton
                  gridAreaName="defending"
                  constants={this.constantProps}
                  label="Defending"
                  type={RobotStates.DEFENDING}
                  phase="AUTO"
                />
              ]}
            />,
            // <Grid
            //   className="input-grid__child"
            //   gridAreaName="team"
            //   cols=""
            //   rows=""
            //   templateArea=""
            //   gridElements={[]}
            // />,
            <Grid
              className="input-grid__child"
              gridAreaName="single-event"
              cols="1fr 1fr"
              rows="20% 40% 40%"
              templateArea="
              'title title'
              'hang        park'
              'initiation    . '"
              gridElements={[
                <div className="input-grid__title">
                  <p>One Time Events</p>
                </div>,
                <RobotEventButton
                  gridAreaName="initiation"
                  constants={this.constantProps}
                  label="Initiation"
                  type={ScorableRobotEvents.INITIATION}
                  phase="AUTO"
                />,
                <RobotEventButton
                  gridAreaName="hang"
                  constants={this.constantProps}
                  label="Hang"
                  type={ScorableRobotEvents.HANG}
                  phase="AUTO"
                />,
                <RobotEventButton
                  gridAreaName="park"
                  constants={this.constantProps}
                  label="Park"
                  type={ScorableRobotEvents.PARK}
                  phase="AUTO"
                />
              ]}
            />
          ]}
        />
      </div>
    );
  }
}
