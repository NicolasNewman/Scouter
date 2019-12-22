import * as React from "react";
import { Component } from "react";
import { bindActionCreators, Dispatch } from "redux";
import { connect } from "react-redux";

import { Modal, Button, Input } from "antd";

import UserActions from "../actions/user";

import Navigation from "../components/Navigation";
import Header from "../components/Header";
import { SocketController, socketEvents } from "../socket/socketController";
import ComponentRouter from "../components/ComponentRouter";

interface IProps {
  username: string;
  isAdmin: boolean;
  isAuthenticated: boolean;
  setUsername: (username: string) => void;
  setAdminStatus: (isAdmin: boolean) => void;
  socket: SocketController;
}

interface IState {
  modalVisible: boolean;
  inputText: string;
}

// export const BaseComponent: React.FC<IBaseComponent> = props => {
class NavContainer extends Component<IProps, IState> {
  props: IProps;
  // socket: SocketIOClient.Socket;

  constructor(props: IProps) {
    super(props);

    this.state = {
      modalVisible: !this.props.isAuthenticated,
      inputText: ""
    };
  }

  componentDidMount() {
    // this.socket = socketIOClient("http://localhost:4000");
    // console.log(this.socket);
    // this.socket.on("adminRes", (res: boolean) => {
    //   console.log(`The admin res is ${res}`);
    //   if (res) {
    //     this.props.setAdminStatus(true);
    //   }
    // });
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
    this.props.socket.emit(socketEvents.adminAuthorize, this.state.inputText);
    this.setState({
      modalVisible: false
    });
  };

  render() {
    return (
      <div>
        <Header
          username={this.props.username}
          isAuthenticated={this.props.isAuthenticated}
        />
        <div className="two-col-nav">
          <div className="two-col-nav__left">
            <Navigation isAdmin={this.props.isAdmin} />
          </div>
          <div className="two-col-nav__right">
            <ComponentRouter isAdmin={this.props.isAdmin} />
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
