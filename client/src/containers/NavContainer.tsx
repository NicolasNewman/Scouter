import * as React from "react";
import { Component } from "react";
import { bindActionCreators, Dispatch } from "redux";
import { connect } from "react-redux";

import { Modal, Button, Input } from "antd";

import UserActions from "../actions/user";

import Navigation from "../components/Navigation";
import Header from "../components/Header";
import * as socketIOClient from "socket.io-client";

interface IProps {
  username: string;
  isAdmin: boolean;
  isAuthenticated: boolean;
  setUsername: (username: string) => void;
  setAdminStatus: (isAdmin: boolean) => void;
  rightComponent: React.ReactType;
}

interface IState {
  modalVisible: boolean;
  inputText: string;
}

// export const BaseComponent: React.FC<IBaseComponent> = props => {
class NavContainer extends Component<IProps, IState> {
  props: IProps;

  constructor(props: IProps) {
    super(props);

    this.state = {
      modalVisible: !this.props.isAuthenticated,
      inputText: ""
    };
  }

  componentDidMount() {
    // const socket = socketIOClient("http://localhost:4000");
    // console.log(socket);
  }

  // componentDidUpdate() {
  //   console.log("update");

  //   console.log(this.props);
  // }

  modelInputTextChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ inputText: e.target.value });
  };

  showModal = () => {
    this.setState({ modalVisible: true });
  };

  handleModalSubmit = () => {
    // const isAdmin = this.props.inputText === "TODO";
    this.props.setUsername(this.state.inputText);
    console.log(this.props);
    this.setState({
      modalVisible: false
    });
  };

  render() {
    const RightComponent = this.props.rightComponent;
    return (
      <div>
        <Header
          username={this.props.username}
          isAuthenticated={this.props.isAuthenticated}
        />
        <div className="two-col-nav">
          <div className="two-col-nav__left">
            <Navigation />
          </div>
          <div className="two-col-nav__right">
            <RightComponent />
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
  return {
    username: state.user.username,
    isAdmin: state.user.isAdmin,
    isAuthenticated: state.user.isAuthenticated
  };
}

function mapDispatchToDrops(dispatch: Dispatch) {
  return bindActionCreators(
    {
      ...UserActions
    },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToDrops)(NavContainer);
