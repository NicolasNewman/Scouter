import * as React from "react";
import { Component } from "react";

import {
  ScoutingTargets,
  SocketController,
  emitableEvents,
} from "../../../classes/socketController";

import Grid from "../../Grid/Grid";

import StateButton from "./DataInputFormComponents/StateButton";

import RequestHandler from "../../../classes/RequestHandler";
import RobotEventButton from "./DataInputFormComponents/RobotEventButton";
import AccuracyEventButton from "./DataInputFormComponents/AccuracyEventButton";
import {
  EScorableRobotEvents,
  EFoulEvents,
  ERobotStates,
} from "../../../global/gameTypes";

interface IProps {
  scoutingTargets: ScoutingTargets;
  matchNumber: number;
  socket: SocketController;
  requestHandler: RequestHandler;
  removeScoutingTarget: (target: string) => void;
  setMatchData: () => void;
}

/**
 * Stores constants that are needed by the event and state buttons
 */
export interface IConstantProps {
  handler: RequestHandler;
  getTime: () => number;
  matchNumber: number;
  teamNumber: number;
  alliance: 'red' | 'blue' | null;
}

interface IState {
  matchTime: number;
  phase: "NONE" | "AUTO" | "TELEOP" | "ENDGAME";
  autoButtonsDisabled: boolean;
  teleopButtonsDisabled: boolean;
  endgameButtonsDisabled: boolean;
  globalDisabled: boolean;
}

export default class Home extends Component<IProps, IState> {
  props: IProps;
  // Stores constants that are needed by the event and state buttons
  constantProps: IConstantProps;
  interval: NodeJS.Timeout;

  constructor(props: IProps) {
    super(props);

    if (this.props.scoutingTargets.length <= 0) {
      this.state = {
        matchTime: 0,
        phase: "NONE",
        autoButtonsDisabled: true,
        teleopButtonsDisabled: true,
        endgameButtonsDisabled: true,
        globalDisabled: true,
      };
      this.constantProps = {
        handler: this.props.requestHandler,
        getTime: this.getTime,
        matchNumber: this.props.matchNumber,
        teamNumber: -1,
        alliance: null
      };
    } else {
      this.state = {
        matchTime: 0,
        phase: "NONE",
        autoButtonsDisabled: true,
        teleopButtonsDisabled: true,
        endgameButtonsDisabled: true,
        globalDisabled: false,
      };
      this.constantProps = {
        handler: this.props.requestHandler,
        getTime: this.getTime,
        matchNumber: this.props.matchNumber,
        teamNumber: parseInt(this.props.scoutingTargets[0].team),
        alliance: this.props.scoutingTargets[0].alliance
      };
    }

    this.componentDidUpdate = () => {
      if (
        this.constantProps.teamNumber === -1 &&
        this.props.scoutingTargets.length > 0
      ) {
        this.constantProps.teamNumber = parseInt(
          this.props.scoutingTargets[0].team
        );
      }
    };

    // Initialize an interval to query the match time from the server
    if (this.props.scoutingTargets.length > 0) {
      this.interval = setInterval(() => {
        this.props.socket.emit(
          emitableEvents.getRemainingTime,
          undefined,
          (remainingTime: number, phase: "AUTO" | "TELEOP" | "ENDGAME") => {
            if (remainingTime < 0) {
              clearInterval(this.interval);
              this.setState({
                matchTime: 0,
                phase: "NONE",
                autoButtonsDisabled: true,
                teleopButtonsDisabled: true,
                endgameButtonsDisabled: true,
                globalDisabled: true,
              });

              const identifier = `${
                this.props.scoutingTargets[0].alliance === "red" ? "r" : "b"
              }-${this.props.scoutingTargets[0].seed}-scout`;

              this.props.socket.emit(
                emitableEvents.scoutingFormSubmited,
                identifier
              );
            } else {
              this.setState({
                matchTime: remainingTime,
                phase,
                autoButtonsDisabled: phase === "AUTO" ? false : true,
                teleopButtonsDisabled: phase === "TELEOP" ? false : true,
                endgameButtonsDisabled: phase === "ENDGAME" ? false : true,
              });
            }
          }
        );
      }, 500);
    }
  }

  getTime = (): number => {
    return this.state.matchTime;
  };

  render() {
    const scoutingTargets = this.props.scoutingTargets
      .map((obj) => {
        return obj.team;
      })
      .join(", ");
    return (
      <div className="scouting">
        <Grid
          className="dashboard"
          templateArea="
          'time phase'
          'match team'"
          rows="1fr 1fr"
          cols="1fr 1fr"
          gridElements={[
            <h1 style={{ gridArea: "time" }}>Time: {this.state.matchTime}s</h1>,
            <h1 style={{ gridArea: "phase" }}>Phase: {this.state.phase}</h1>,
            <h2 style={{ gridArea: "match" }}>
              Match: {this.props.matchNumber}
            </h2>,
            <h2 style={{ gridArea: "team" }}>Team: {scoutingTargets}</h2>,
          ]}
        />
        <Grid
          className="input-grid"
          cols="20% 40% 40%"
          rows="1fr 1fr 1fr"
          templateArea="
          'multi-event single-event  state' 
          'multi-event  foul-event   state'
          '    .       wheel-event     .  '"
          gridElements={[
            <Grid
              gridAreaName="multi-event"
              className="input-grid__child"
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
                // <AccuracyEventButton
                //   gridAreaName="inner"
                //   constants={this.constantProps}
                //   label="Inner"
                //   type={EScorableRobotEvents.POWERCELLS_INNER}
                //   disabled={this.state.globalDisabled}
                //   phase={
                //     this.state.phase === "NONE" ? "AUTO" : this.state.phase
                //   }
                // />,
                <AccuracyEventButton
                  gridAreaName="outer"
                  constants={this.constantProps}
                  // label="Outer"
                  label="Top"
                  type={EScorableRobotEvents.POWERCELLS_OUTER}
                  disabled={this.state.globalDisabled}
                  phase={
                    this.state.phase === "NONE" ? "AUTO" : this.state.phase
                  }
                />,
                <AccuracyEventButton
                  gridAreaName="bottom"
                  constants={this.constantProps}
                  label="Bottom "
                  type={EScorableRobotEvents.POWERCELLS_BOTTOM}
                  disabled={this.state.globalDisabled}
                  phase={
                    this.state.phase === "NONE" ? "AUTO" : this.state.phase
                  }
                />,
              ]}
            />,
            <Grid
              gridAreaName="foul-event"
              className="input-grid__child"
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
                  type={EFoulEvents.FOUL}
                  disabled={this.state.globalDisabled}
                  phase={
                    this.state.phase === "NONE" ? "AUTO" : this.state.phase
                  }
                />,
                <RobotEventButton
                  gridAreaName="tech"
                  constants={this.constantProps}
                  label="Tech Foul"
                  type={EFoulEvents.TECH_FOUL}
                  disabled={this.state.globalDisabled}
                  phase={
                    this.state.phase === "NONE" ? "AUTO" : this.state.phase
                  }
                />,
                <RobotEventButton
                  gridAreaName="yellow"
                  constants={this.constantProps}
                  label="Yellow Card"
                  type={EFoulEvents.YELLOW_CARD}
                  disabled={this.state.globalDisabled}
                  phase={
                    this.state.phase === "NONE" ? "AUTO" : this.state.phase
                  }
                />,
                <RobotEventButton
                  gridAreaName="red"
                  constants={this.constantProps}
                  label="Red Card"
                  type={EFoulEvents.RED_CARD}
                  disabled={this.state.globalDisabled}
                  phase={
                    this.state.phase === "NONE" ? "AUTO" : this.state.phase
                  }
                />,
              ]}
            />,
            <Grid
              gridAreaName="state"
              className="input-grid__child"
              cols="1fr 1fr"
              rows="10% 30% 30% 30%"
              templateArea="
              'title      title   '
              'gather     shooting'
              'wheel      climbing'
              'defending  defended'"
              gridElements={[
                <div className="input-grid__title">
                  <p>States</p>
                </div>,
                <StateButton
                  gridAreaName="wheel"
                  constants={this.constantProps}
                  label="Wheel"
                  type={ERobotStates.WHEEL}
                  disabled={
                    this.state.globalDisabled ||
                    (this.state.teleopButtonsDisabled &&
                      this.state.endgameButtonsDisabled)
                  }
                  phase={
                    this.state.phase === "NONE" ? "AUTO" : this.state.phase
                  }
                />,
                <StateButton
                  gridAreaName="shooting"
                  constants={this.constantProps}
                  label="Shooting"
                  type={ERobotStates.SHOOTING}
                  disabled={this.state.globalDisabled}
                  phase={
                    this.state.phase === "NONE" ? "AUTO" : this.state.phase
                  }
                />,
                <StateButton
                  gridAreaName="gather"
                  constants={this.constantProps}
                  label="Gathering"
                  type={ERobotStates.GATHERING}
                  disabled={this.state.globalDisabled}
                  phase={
                    this.state.phase === "NONE" ? "AUTO" : this.state.phase
                  }
                />,
                <StateButton
                  gridAreaName="climbing"
                  constants={this.constantProps}
                  label="Climbing"
                  type={ERobotStates.CLIMBING}
                  disabled={
                    this.state.globalDisabled ||
                    this.state.endgameButtonsDisabled
                  }
                  phase={
                    this.state.phase === "NONE" ? "AUTO" : this.state.phase
                  }
                />,
                <StateButton
                  gridAreaName="defending"
                  constants={this.constantProps}
                  label="Defending"
                  type={ERobotStates.DEFENDING}
                  disabled={this.state.globalDisabled}
                  phase={
                    this.state.phase === "NONE" ? "AUTO" : this.state.phase
                  }
                />,
                <StateButton
                  gridAreaName="defended"
                  constants={this.constantProps}
                  label="Defended"
                  type={ERobotStates.DEFENDED}
                  disabled={this.state.globalDisabled}
                  phase={
                    this.state.phase === "NONE" ? "AUTO" : this.state.phase
                  }
                />,
              ]}
            />,
            // TODO re-add the team events
            // <Grid
            //   className="input-grid__child"
            //   gridAreaName="team"
            //   cols=""
            //   rows=""
            //   templateArea=""
            //   gridElements={[]}
            // />,
            <Grid
              gridAreaName="single-event"
              className="input-grid__child"
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
                  type={EScorableRobotEvents.INITIATION}
                  disabled={
                    this.state.globalDisabled || this.state.autoButtonsDisabled
                  }
                  phase={
                    this.state.phase === "NONE" ? "AUTO" : this.state.phase
                  }
                />,
                <RobotEventButton
                  gridAreaName="hang"
                  constants={this.constantProps}
                  label="Hang"
                  type={EScorableRobotEvents.HANG}
                  disabled={
                    this.state.globalDisabled ||
                    this.state.endgameButtonsDisabled
                  }
                  phase={
                    this.state.phase === "NONE" ? "AUTO" : this.state.phase
                  }
                />,
                <RobotEventButton
                  gridAreaName="park"
                  constants={this.constantProps}
                  label="Park"
                  type={EScorableRobotEvents.PARK}
                  disabled={
                    this.state.globalDisabled ||
                    this.state.endgameButtonsDisabled
                  }
                  phase={
                    this.state.phase === "NONE" ? "AUTO" : this.state.phase
                  }
                />,
              ]}
            />,
            <Grid
              gridAreaName="wheel-event"
              className="input-grid__child"
              cols="1fr 1fr"
              rows="20% 80%"
              templateArea="
              'title       title'
              'position rotation'"
              gridElements={[
                <div className="input-grid__title">
                  <p>Wheel Events</p>
                </div>,
                <RobotEventButton
                  gridAreaName="position"
                  constants={this.constantProps}
                  label="Position"
                  type={EScorableRobotEvents.POSITION_CONTROL}
                  disabled={
                    this.state.globalDisabled ||
                    (this.state.teleopButtonsDisabled &&
                      this.state.endgameButtonsDisabled)
                  }
                  phase={
                    this.state.phase === "NONE" ? "AUTO" : this.state.phase
                  }
                />,
                <RobotEventButton
                  gridAreaName="rotation"
                  constants={this.constantProps}
                  label="Rotation"
                  type={EScorableRobotEvents.ROTATION_CONTROL}
                  disabled={this.state.globalDisabled}
                  phase={
                    this.state.phase === "NONE" ? "AUTO" : this.state.phase
                  }
                />,
              ]}
            />,
          ]}
        />
      </div>
    );
  }
}
