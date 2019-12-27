import * as React from "react";
import { Component } from "react";
import { bindActionCreators, Dispatch } from "redux";
import { connect } from "react-redux";

import { Modal, Button, Input, message } from "antd";

import UserActions from "../actions/user";
import AdminActions from "../actions/admin";
import ScoutingActions from "../actions/scouting";

import Navigation from "../components/Navigation";
import Header from "../components/Header";
import ComponentRouter from "../components/ComponentRouter";

import {
  SocketController,
  emitableEvents,
  ScoutingTargets
} from "../classes/socketController";
import RequestHandler from "../classes/RequestHandler";

import { IAdminFormState, IAdminScoutStatus } from "../reducers/admin";

interface IProps {
  username: string;
  isAdmin: boolean;
  isAuthenticated: boolean;
  setUsername: (username: string) => void;
  setAdminStatus: (isAdmin: boolean) => void;
  formState: IAdminFormState;
  scoutStatus: IAdminScoutStatus;
  inProgress: boolean;
  setFormState: (state: IAdminFormState) => void;
  setFormField: (field: string, value: string) => void;
  socket: SocketController;
  requestHandler: RequestHandler;
  scoutingTargets: ScoutingTargets;
  matchNumber: number;
  isActive: boolean;
}

interface IState {
  modalVisible: boolean;
  inputText: string;
}

class NavContainer extends Component<IProps, IState> {
  props: IProps;

  constructor(props: IProps) {
    super(props);

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
    // this.props.setUsername(this.state.inputText);
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
    if (this.props.isActive) {
      message.info("The scouting form is now active!");
    }
    console.log(this.props.scoutingTargets);
    console.log(this.props.matchNumber);

    return (
      <div>
        <Header
          username={this.props.username}
          isAuthenticated={this.props.isAuthenticated}
        />
        <div className="two-col-nav">
          <div className="two-col-nav__left">
            <Navigation
              isActive={this.props.isActive}
              isAdmin={this.props.isAdmin}
            />
          </div>
          <div className="two-col-nav__right">
            <ComponentRouter
              requestHandler={this.props.requestHandler}
              socket={this.props.socket}
              isAdmin={this.props.isAdmin}
              formState={this.props.formState}
              scoutStatus={this.props.scoutStatus}
              inProgress={this.props.inProgress}
              setFormState={this.props.setFormState}
              setFormField={this.props.setFormField}
              scoutingTargets={this.props.scoutingTargets}
              matchNumber={this.props.matchNumber}
            />
          </div>
        </div>
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

function mapStateToProps(state: any, ownProps: any) {
  console.log(state);
  return {
    username: state.user.username,
    isAdmin: state.user.isAdmin,
    isAuthenticated: state.user.isAuthenticated,
    formState: state.admin.formState,
    scoutStatus: state.admin.scoutStatus,
    inProgress: state.admin.inProgress,
    scoutingTargets: state.scouting.targets,
    matchNumber: state.scouting.matchNumber,
    isActive: state.scouting.isActive
  };
}

function mapDispatchToDrops(dispatch: Dispatch) {
  return bindActionCreators(
    {
      ...UserActions,
      ...AdminActions,
      ...ScoutingActions
    },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToDrops)(NavContainer);
