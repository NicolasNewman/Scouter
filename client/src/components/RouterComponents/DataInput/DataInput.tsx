import * as React from "react";
import { Component } from "react";

import {
  ScoutingTargets,
  SocketController,
  emitableEvents
} from "../../../classes/socketController";

import Grid from "../../Grid/Grid";

import StateButton from "./DataInputFormComponents/StateButton";

import RequestHandler from "../../../classes/RequestHandler";
import RobotEventButton from "./DataInputFormComponents/RobotEventButton";
import AccuracyEventButton from "./DataInputFormComponents/AccuracyEventButton";
import {
  EScorableRobotEvents,
  EFoulEvents,
  ERobotStates
} from "../../../global/gameTypes";

interface IProps {
  scoutingTargets: ScoutingTargets;
  matchNumber: number;
  socket: SocketController;
  requestHandler: RequestHandler;
  removeScoutingTarget: (target: string) => void;
  setMatchData: () => void;
}

export interface IConstantProps {
  handler: RequestHandler;
  getTime: () => number;
  matchNumber: number;
  teamNumber: number;
}

interface IState {
  matchTime: number;
  phase: "NONE" | "AUTO" | "TELEOP" | "ENDGAME";
  autoButtonsDisabled: boolean;
  teleopButtonsDisabled: boolean;
  endgameButtonsDisabled: boolean;
}

export default class Home extends Component<IProps, IState> {
  props: IProps;
  constantProps: IConstantProps;

  constructor(props: IProps) {
    super(props);

    this.state = {
      matchTime: 0,
      phase: "NONE",
      autoButtonsDisabled: true,
      teleopButtonsDisabled: true,
      endgameButtonsDisabled: true
    };

    this.constantProps = {
      handler: this.props.requestHandler,
      getTime: this.getTime,
      matchNumber: this.props.matchNumber,
      teamNumber: parseInt(this.props.scoutingTargets[0].team)
    };

    setInterval(() => {
      this.props.socket.emit(
        emitableEvents.getRemainingTime,
        undefined,
        (remainingTime: number, phase: "AUTO" | "TELEOP" | "ENDGAME") => {
          this.setState({
            matchTime: remainingTime,
            phase,
            autoButtonsDisabled: phase === "AUTO" ? false : true,
            teleopButtonsDisabled: phase === "TELEOP" ? false : true,
            endgameButtonsDisabled: phase === "ENDGAME" ? false : true
          });
        }
      );
    }, 500);
  }

  getTime = (): number => {
    return this.state.matchTime;
  };

  render() {
    const scoutingTargets = this.props.scoutingTargets
      .map(obj => {
        return obj.team;
      })
      .join(", ");
    return (
      <div className="scouting">
        {/* <h1>Match: {this.props.matchNumber}</h1>
        <h1>Scouting: {scoutingTargets}</h1>
        <h1>Time Left: {this.state.matchTime}</h1> */}
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
            <h2 style={{ gridArea: "team" }}>Team: {scoutingTargets}</h2>
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
                <AccuracyEventButton
                  gridAreaName="inner"
                  constants={this.constantProps}
                  label="Inner"
                  type={EScorableRobotEvents.POWERCELLS_INNER}
                  phase={
                    this.state.phase === "NONE" ? "AUTO" : this.state.phase
                  }
                />,
                <AccuracyEventButton
                  gridAreaName="outer"
                  constants={this.constantProps}
                  label="Outer"
                  type={EScorableRobotEvents.POWERCELLS_OUTER}
                  phase={
                    this.state.phase === "NONE" ? "AUTO" : this.state.phase
                  }
                />,
                <AccuracyEventButton
                  gridAreaName="bottom"
                  constants={this.constantProps}
                  label="Bottom "
                  type={EScorableRobotEvents.POWERCELLS_BOTTOM}
                  phase={
                    this.state.phase === "NONE" ? "AUTO" : this.state.phase
                  }
                />
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
                  phase={
                    this.state.phase === "NONE" ? "AUTO" : this.state.phase
                  }
                />,
                <RobotEventButton
                  gridAreaName="tech"
                  constants={this.constantProps}
                  label="Tech Foul"
                  type={EFoulEvents.TECH_FOUL}
                  phase={
                    this.state.phase === "NONE" ? "AUTO" : this.state.phase
                  }
                />,
                <RobotEventButton
                  gridAreaName="yellow"
                  constants={this.constantProps}
                  label="Yellow Card"
                  type={EFoulEvents.YELLOW_CARD}
                  phase={
                    this.state.phase === "NONE" ? "AUTO" : this.state.phase
                  }
                />,
                <RobotEventButton
                  gridAreaName="red"
                  constants={this.constantProps}
                  label="Red Card"
                  type={EFoulEvents.RED_CARD}
                  phase={
                    this.state.phase === "NONE" ? "AUTO" : this.state.phase
                  }
                />
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
              'defending      .   '"
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
                    this.state.teleopButtonsDisabled &&
                    this.state.endgameButtonsDisabled
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
                  phase={
                    this.state.phase === "NONE" ? "AUTO" : this.state.phase
                  }
                />,
                <StateButton
                  gridAreaName="gather"
                  constants={this.constantProps}
                  label="Gathering"
                  type={ERobotStates.GATHERING}
                  phase={
                    this.state.phase === "NONE" ? "AUTO" : this.state.phase
                  }
                />,
                <StateButton
                  gridAreaName="climbing"
                  constants={this.constantProps}
                  label="Climbing"
                  type={ERobotStates.CLIMBING}
                  disabled={this.state.endgameButtonsDisabled}
                  phase={
                    this.state.phase === "NONE" ? "AUTO" : this.state.phase
                  }
                />,
                <StateButton
                  gridAreaName="defending"
                  constants={this.constantProps}
                  label="Defending"
                  type={ERobotStates.DEFENDING}
                  phase={
                    this.state.phase === "NONE" ? "AUTO" : this.state.phase
                  }
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
                  disabled={this.state.autoButtonsDisabled}
                  phase={
                    this.state.phase === "NONE" ? "AUTO" : this.state.phase
                  }
                />,
                <RobotEventButton
                  gridAreaName="hang"
                  constants={this.constantProps}
                  label="Hang"
                  type={EScorableRobotEvents.HANG}
                  disabled={this.state.endgameButtonsDisabled}
                  phase={
                    this.state.phase === "NONE" ? "AUTO" : this.state.phase
                  }
                />,
                <RobotEventButton
                  gridAreaName="park"
                  constants={this.constantProps}
                  label="Park"
                  type={EScorableRobotEvents.PARK}
                  disabled={this.state.endgameButtonsDisabled}
                  phase={
                    this.state.phase === "NONE" ? "AUTO" : this.state.phase
                  }
                />
              ]}
            />,
            <Grid
              gridAreaName="wheel-event"
              className="input-grid__child"
              cols="1f 1fr"
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
                    this.state.teleopButtonsDisabled &&
                    this.state.endgameButtonsDisabled
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
                  phase={
                    this.state.phase === "NONE" ? "AUTO" : this.state.phase
                  }
                />
              ]}
            />
          ]}
        />
        {/* <Grid
          cols="1fr 1fr 1fr 1fr"
          rows="1fr 1fr"
          templateArea="
          'multi-event single-event foul-event state' 
          'multi-event       .      foul-event state'"
          gridElements={[
            <Grid
              gridAreaName="multi-event"
              cols="1fr"
              rows="1fr 1fr 1fr"
              templateArea="
              'inner'
              'outer'
              'bottom'"
              gridElements={[
                <RobotEventButton
                  gridAreaName="inner"
                  constants={this.constantProps}
                  label="Inner Powercell"
                  type={ScorableRobotEvents.POWERCELLS_INNER}
                  phase={
                    this.state.phase === "NONE" ? "AUTO" : this.state.phase
                  }
                />,
                <RobotEventButton
                  gridAreaName="outer"
                  constants={this.constantProps}
                  label="Outer Powercell"
                  type={ScorableRobotEvents.POWERCELLS_OUTER}
                  phase={
                    this.state.phase === "NONE" ? "AUTO" : this.state.phase
                  }
                />,
                <RobotEventButton
                  gridAreaName="bottom"
                  constants={this.constantProps}
                  label="Bottom Powercell"
                  type={ScorableRobotEvents.POWERCELLS_BOTTOM}
                  phase={
                    this.state.phase === "NONE" ? "AUTO" : this.state.phase
                  }
                />
              ]}
            />,
            <Grid
              gridAreaName="foul-event"
              cols="1fr 1fr"
              rows="1fr 1fr"
              templateArea="
              'foul tech'
              'yellow red'"
              gridElements={[
                <RobotEventButton
                  gridAreaName="foul"
                  constants={this.constantProps}
                  label="Foul"
                  type={FoulEvents.FOUL}
                  phase={
                    this.state.phase === "NONE" ? "AUTO" : this.state.phase
                  }
                />,
                <RobotEventButton
                  gridAreaName="tech"
                  constants={this.constantProps}
                  label="Tech Foul"
                  type={FoulEvents.TECH_FOUL}
                  phase={
                    this.state.phase === "NONE" ? "AUTO" : this.state.phase
                  }
                />,
                <RobotEventButton
                  gridAreaName="yellow"
                  constants={this.constantProps}
                  label="Yellow Card"
                  type={FoulEvents.YELLOW_CARD}
                  phase={
                    this.state.phase === "NONE" ? "AUTO" : this.state.phase
                  }
                />,
                <RobotEventButton
                  gridAreaName="red"
                  constants={this.constantProps}
                  label="Red Card"
                  type={FoulEvents.RED_CARD}
                  phase={
                    this.state.phase === "NONE" ? "AUTO" : this.state.phase
                  }
                />
              ]}
            />,
            <Grid
              gridAreaName="state"
              cols="1fr 1fr"
              rows="1fr 1fr 1fr"
              templateArea="
              'gather     shooting'
              'wheel      climbing'
              'defending      .   '"
              gridElements={[
                <StateButton
                  gridAreaName="wheel"
                  constants={this.constantProps}
                  label="Spinning Wheel"
                  type={RobotStates.WHEEL}
                  phase={
                    this.state.phase === "NONE" ? "AUTO" : this.state.phase
                  }
                />,
                <StateButton
                  gridAreaName="shooting"
                  constants={this.constantProps}
                  label="Shooting"
                  type={RobotStates.SHOOTING}
                  phase={
                    this.state.phase === "NONE" ? "AUTO" : this.state.phase
                  }
                />,
                <StateButton
                  gridAreaName="gathering"
                  constants={this.constantProps}
                  label="Gathering"
                  type={RobotStates.GATHERING}
                  phase={
                    this.state.phase === "NONE" ? "AUTO" : this.state.phase
                  }
                />,
                <StateButton
                  gridAreaName="climbing"
                  constants={this.constantProps}
                  label="Climbing"
                  type={RobotStates.CLIMBING}
                  phase={
                    this.state.phase === "NONE" ? "AUTO" : this.state.phase
                  }
                />,
                <StateButton
                  gridAreaName="defending"
                  constants={this.constantProps}
                  label="Defending"
                  type={RobotStates.DEFENDING}
                  phase={
                    this.state.phase === "NONE" ? "AUTO" : this.state.phase
                  }
                />
              ]}
            />,
            <Grid
              gridAreaName="team"
              cols=""
              rows=""
              templateArea=""
              gridElements={[]}
            />,
            <Grid
              gridAreaName="single-event"
              cols="1fr 1fr"
              rows="1fr 1fr"
              templateArea="
              'hang        park'
              'initiation    . '"
              gridElements={[
                <RobotEventButton
                  gridAreaName="initiation"
                  constants={this.constantProps}
                  label="Initiation"
                  type={ScorableRobotEvents.INITIATION}
                  phase={
                    this.state.phase === "NONE" ? "AUTO" : this.state.phase
                  }
                />,
                <RobotEventButton
                  gridAreaName="hang"
                  constants={this.constantProps}
                  label="Hang"
                  type={ScorableRobotEvents.HANG}
                  phase={
                    this.state.phase === "NONE" ? "AUTO" : this.state.phase
                  }
                />,
                <RobotEventButton
                  gridAreaName="park"
                  constants={this.constantProps}
                  label="Park"
                  type={ScorableRobotEvents.PARK}
                  phase={
                    this.state.phase === "NONE" ? "AUTO" : this.state.phase
                  }
                />
              ]}
            />
          ]}
        /> */}

        {/* <RobotEventButton
          constants={this.constantProps}
          label="event"
          type={ScorableRobotEvents.POSITION_CONTROL}
          phase={this.state.phase === "NONE" ? "AUTO" : this.state.phase}
        />
        <StateButton
          constants={this.constantProps}
          label="state"
          type={RobotStates.DEFENDING}
          phase={this.state.phase === "NONE" ? "AUTO" : this.state.phase}
        /> */}
        {/* <Tabs> // REWORK target removal
          {this.props.scoutingTargets.map(target => (
            <TabPane tab={target.team} key={target.team}>
              <DataForm
                team={target.team}
                alliance={target.alliance}
                seed={target.seed}
                matchNumber={this.props.matchNumber}
                socket={this.props.socket}
                requestHandler={this.props.requestHandler}
                removeScoutingTarget={this.props.removeScoutingTarget}
                setMatchData={this.props.setMatchData}
              />
            </TabPane>
          ))}
        </Tabs> */}
      </div>
    );
  }
}
