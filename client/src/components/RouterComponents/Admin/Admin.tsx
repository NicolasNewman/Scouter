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

/**
 * Component for the admin control pane
 */
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
            this.props.setSelectedMainTab(activeKey);
          }}
          defaultActiveKey={this.props.keyOfSelectedMainTab}
        >
          {/* Tab for entering and mofiying db entries */}
          <TabPane tab="Team Entry" key={MainTabKeys.DB_ENTRY}>
            <AdminTeamEntry requestHandler={this.props.requestHandler} />
          </TabPane>
          {/* Tab for assigning scouts and viewing the status */}
          <TabPane tab="Scouting Assigner" key={MainTabKeys.ASSIGNMENT_FORM}>
            {/* Swap components from form to scout status if a session is in progress */}
            {this.props.inProgress ? (
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
