import * as React from "react";
import { Component } from "react";

import { Tabs } from "antd";
const { TabPane } = Tabs;

import RequestHandler from "../../classes/RequestHandler";
import { SocketController } from "../../classes/socketController";
import { IAdminFormState, IAdminScoutStatus } from "../../reducers/admin";
import AdminForm from "../AdminTabComponents/AdminForm";
import AdminTeamEntry from "../AdminTabComponents/AdminTeamEntry";
import AdminScoutStatus from "../AdminTabComponents/AdminScoutStatus";

interface IProps {
  requestHandler: RequestHandler;
  socket: SocketController;
  formState: IAdminFormState;
  scoutStatus: IAdminScoutStatus;
  inProgress: boolean;
  setFormState: (state: IAdminFormState) => void;
  setFormField: (field: keyof IAdminFormState, value: string) => void;
}

export default class Admin extends Component<IProps> {
  constructor(props: IProps) {
    super(props);
  }

  render() {
    return (
      <div>
        <Tabs>
          <TabPane tab="Team Entry" key="entry">
            <AdminTeamEntry requestHandler={this.props.requestHandler} />
          </TabPane>
          <TabPane tab="Scouting Assigner" key="form">
            {this.props.inProgress ? (
              // {true ? (
              <AdminScoutStatus
                formState={this.props.formState}
                scoutStatus={this.props.scoutStatus}
              />
            ) : (
              <AdminForm
                requestHandler={this.props.requestHandler}
                formState={this.props.formState}
                socket={this.props.socket}
                setFormField={this.props.setFormField}
                setFormState={this.props.setFormState}
              />
            )}
          </TabPane>
        </Tabs>
      </div>
    );
  }
}
