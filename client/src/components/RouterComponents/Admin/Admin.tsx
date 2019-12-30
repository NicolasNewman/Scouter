import * as React from "react";
import { Component } from "react";

import { Tabs } from "antd";
const { TabPane } = Tabs;

import RequestHandler from "../../../classes/RequestHandler";
import { SocketController } from "../../../classes/socketController";
import {
  IAdminFormState,
  IAdminScoutStatus,
  MainTabKeys
} from "../../../reducers/admin";
import AdminForm from "./AdminTabComponents/AdminForm";
import AdminTeamEntry from "./AdminTabComponents/AdminTeamEntry";
import AdminScoutStatus from "./AdminTabComponents/AdminScoutStatus";

interface IProps {
  requestHandler: RequestHandler;
  socket: SocketController;
  formState: IAdminFormState;
  scoutStatus: IAdminScoutStatus;
  inProgress: boolean;
  keyOfSelectedMainTab: MainTabKeys;
  setFormState: (state: IAdminFormState) => void;
  setFormField: (field: keyof IAdminFormState, value: string) => void;
  startSession: () => void;
  endSession: () => void;
  setSelectedMainTab: (key: MainTabKeys) => void;
}

export default class Admin extends Component<IProps> {
  constructor(props: IProps) {
    super(props);
  }

  render() {
    console.log(this.props.keyOfSelectedMainTab);

    return (
      <div>
        <Tabs
          onChange={(activeKey: MainTabKeys) => {
            console.log(activeKey);

            this.props.setSelectedMainTab(activeKey);
          }}
          defaultActiveKey={this.props.keyOfSelectedMainTab}
        >
          <TabPane tab="Team Entry" key={MainTabKeys.DB_ENTRY}>
            <AdminTeamEntry requestHandler={this.props.requestHandler} />
          </TabPane>
          <TabPane tab="Scouting Assigner" key={MainTabKeys.ASSIGNMENT_FORM}>
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
                startSession={this.props.startSession}
              />
            )}
          </TabPane>
        </Tabs>
      </div>
    );
  }
}
