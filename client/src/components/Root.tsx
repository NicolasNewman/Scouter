import * as React from "react";
import { Component } from "react";

import { Modal, Button, Input, message } from "antd";

// Component imports
import Navigation from "../components/Navigation";
import Header from "../components/Header";
import ComponentRouter from "../components/ComponentRouter";

// Class imports
import RequestHandler from "../classes/RequestHandler";
import {
  SocketController,
  emitableEvents,
  ScoutingTargets
} from "../classes/socketController";

// Type imports
import { History } from "history";
import {
  IAdminFormState,
  IAdminScoutStatus,
  MainTabKeys
} from "../reducers/admin";
import { IStatisticData, ICompetitionData } from "../reducers/data";

interface IProps {
  socket: SocketController;
  requestHandler: RequestHandler;
  history: History;
  // user
  username: string;
  isAdmin: boolean;
  isAuthenticated: boolean;
  setUsername: (username: string) => void;
  setAdminStatus: (isAdmin: boolean) => void;
  // admin
  formState: IAdminFormState;
  scoutStatus: IAdminScoutStatus;
  inProgress: boolean;
  removeScoutingTarget: (target: string) => void;
  keyOfSelectedMainTab: MainTabKeys;
  setFormState: (state: IAdminFormState) => void;
  setFormField: (field: string, value: string) => void;
  startSession: () => void;
  endSession: () => void;
  setSelectedMainTab: (key: MainTabKeys) => void;
  // scouting
  scoutingTargets: ScoutingTargets;
  matchNumber: number;
  isActive: boolean;
  // data
  competitionData: ICompetitionData;
  teamMins: IStatisticData;
  teamMaxes: IStatisticData;
  teamAverages: IStatisticData;
  setMatchData: () => void;
}

interface IState {
  modalVisible: boolean;
  inputText: string;
}

/**
 * The root component containing all the other components needed by Scouter
 */
export default class Root extends Component<IProps, IState> {
  props: IProps;

  constructor(props: IProps) {
    super(props);
    this.props.setMatchData();

    this.state = {
      modalVisible: !this.props.isAuthenticated,
      inputText: ""
    };
  }

  modelInputTextChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ inputText: e.target.value });
  };

  showModal = () => {
    this.setState({ modalVisible: true });
  };

  handleModalSubmit = () => {
    this.props.socket.emit(
      emitableEvents.registerUser,
      this.state.inputText,
      isNameTaken => {
        if (isNameTaken) {
          message.error("That name is already taken");
        } else {
          this.props.setUsername(this.state.inputText);
          this.setState({
            modalVisible: false
          });
        }
      }
    );
  };

  render() {
    // TODO integrate on user submit form
    return (
      <div>
        <Header
          username={this.props.username}
          isAuthenticated={this.props.isAuthenticated}
        />
        <div className="two-col-nav">
          {/* Left-hand naviation column */}
          <div className="two-col-nav__left">
            <Navigation
              isActive={this.props.isActive}
              isAdmin={this.props.isAdmin}
            />
          </div>
          {/* Right-hand pane that displays the path's corrosponding component */}
          <div className="two-col-nav__right">
            <ComponentRouter
              requestHandler={this.props.requestHandler}
              socket={this.props.socket}
              history={this.props.history}
              isAdmin={this.props.isAdmin}
              formState={this.props.formState}
              scoutStatus={this.props.scoutStatus}
              inProgress={this.props.inProgress}
              removeScoutingTarget={this.props.removeScoutingTarget}
              keyOfSelectedMainTab={this.props.keyOfSelectedMainTab}
              setFormState={this.props.setFormState}
              setFormField={this.props.setFormField}
              scoutingTargets={this.props.scoutingTargets}
              startSession={this.props.startSession}
              endSession={this.props.endSession}
              setSelectedMainTab={this.props.setSelectedMainTab}
              matchNumber={this.props.matchNumber}
              teamMins={this.props.teamMins}
              teamMaxes={this.props.teamMaxes}
              teamAverages={this.props.teamAverages}
            />
          </div>
        </div>
        {/* The popup modal that asks the user to register */}
        {/* See https://ant.design/components/modal/ */}
        <Modal
          visible={this.state.modalVisible}
          title="Please enter your name:"
          footer={[
            <Button key="submit" onClick={this.handleModalSubmit}>
              Submit
            </Button>
          ]}
        >
          <Input onChange={this.modelInputTextChanged} placeholder="Name" />
        </Modal>
      </div>
    );
  }
}
