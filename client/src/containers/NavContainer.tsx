import * as React from "react";
import { Component } from "react";
import { bindActionCreators, Dispatch } from "redux";
import { connect } from "react-redux";

import { Modal, Button, Input, message } from "antd";

import UserActions from "../actions/user";
import AdminActions from "../actions/admin";
import ScoutingActions from "../actions/scouting";

import { IAdminFormState } from "../reducers/admin";

import Navigation from "../components/Navigation";
import Header from "../components/Header";
import { SocketController, emitableEvents } from "../classes/socketController";
import ComponentRouter from "../components/ComponentRouter";
import RequestHandler from "../classes/RequestHandler";

interface IProps {
  username: string;
  isAdmin: boolean;
  isAuthenticated: boolean;
  setUsername: (username: string) => void;
  setAdminStatus: (isAdmin: boolean) => void;
  formState: IAdminFormState;
  setFormState: (state: IAdminFormState) => void;
  setFormField: (field: string, value: string) => void;
  socket: SocketController;
  requestHandler: RequestHandler;
  scoutingTargets: Array<string>;
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
              setFormState={this.props.setFormState}
              setFormField={this.props.setFormField}
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
    scoutingTargets: state.scouting.scoutingTargets,
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
