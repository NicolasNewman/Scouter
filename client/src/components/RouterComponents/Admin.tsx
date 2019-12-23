import * as React from "react";
import { Component } from "react";
import { FormComponentProps } from "antd/lib/form/Form";

import { Form, Button } from "antd";
import TeamScoutAssigner from "../FormComponents/TeamScoutAssigner";
import RequestHandler from "../../classes/RequestHandler";
import {
  SocketController,
  emitableEvents
} from "../../classes/socketController";

interface IProps {
  requestHandler: RequestHandler;
  socket: SocketController;
}

interface IState {
  teams: Array<string>;
  users: Array<string>;
}

class Admin extends Component<IProps & FormComponentProps, IState> {
  constructor(props: IProps & FormComponentProps) {
    super(props);
    this.state = {
      teams: [],
      users: []
    };
  }

  async componentDidMount() {
    const data = await this.props.requestHandler.get("teams");

    const teams = data.data.data.teams;
    const teamNumbers: Array<string> = [];
    teams.forEach((team: any) => {
      teamNumbers.push(team.teamNumber);
    });

    this.props.socket.emit(emitableEvents.getUsers, undefined, users => {
      //TODO refresh if another user connects while page is loaded
      this.setState({ users });
    });

    this.setState({
      teams: teamNumbers
    });
  }

  handleSubmit = (e: React.SyntheticEvent) => {
    console.log(e);
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log("Received values of form: ", values);
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    this.props.form.validateFields;
    return (
      <Form className="admin__form" onSubmit={this.handleSubmit}>
        <div className="admin">
          <div className="admin__col">
            <h1 className="admin__heading red">Red Alliance</h1>
            <div className="admin__form--row">
              <TeamScoutAssigner
                selectValues={this.state.teams}
                getFieldDecorator={getFieldDecorator}
                formLabel="S1 Team"
                labelClasses="red"
                componentID="r-s1-team"
                tooltip={false}
              />
              <TeamScoutAssigner
                selectValues={this.state.users}
                getFieldDecorator={getFieldDecorator}
                formLabel="S1 Scout"
                labelClasses="red"
                componentID="r-s1-scout"
                tooltip={false}
              />
            </div>
            <div className="admin__form--row">
              <TeamScoutAssigner
                selectValues={this.state.teams}
                getFieldDecorator={getFieldDecorator}
                formLabel="S2 Team"
                labelClasses="red"
                componentID="r-s2-team"
                tooltip={false}
              />
              <TeamScoutAssigner
                selectValues={this.state.users}
                getFieldDecorator={getFieldDecorator}
                formLabel="S2 Scout"
                labelClasses="red"
                componentID="r-s2-scout"
                tooltip={false}
              />
            </div>
            <div className="admin__form--row">
              <TeamScoutAssigner
                selectValues={this.state.teams}
                getFieldDecorator={getFieldDecorator}
                formLabel="S3 Team"
                labelClasses="red"
                componentID="r-s3-team"
                tooltip={false}
              />
              <TeamScoutAssigner
                selectValues={this.state.users}
                getFieldDecorator={getFieldDecorator}
                formLabel="S3 Scout"
                labelClasses="red"
                componentID="r-s3-scout"
                tooltip={false}
              />
            </div>
          </div>
          <div className="admin__col">
            <h1 className="admin__heading blue">Blue Alliance</h1>
            <div className="admin__form--row">
              <TeamScoutAssigner
                selectValues={this.state.teams}
                getFieldDecorator={getFieldDecorator}
                formLabel="S1 Team"
                labelClasses="blue"
                componentID="b-s1-team"
                tooltip={false}
              />
              <TeamScoutAssigner
                selectValues={this.state.users}
                getFieldDecorator={getFieldDecorator}
                formLabel="S1 Scout"
                labelClasses="blue"
                componentID="b-s1-scout"
                tooltip={false}
              />
            </div>
            <div className="admin__form--row">
              <TeamScoutAssigner
                selectValues={this.state.teams}
                getFieldDecorator={getFieldDecorator}
                formLabel="S2 Team"
                labelClasses="blue"
                componentID="b-s2-team"
                tooltip={false}
              />
              <TeamScoutAssigner
                selectValues={this.state.users}
                getFieldDecorator={getFieldDecorator}
                formLabel="S2 Scout"
                labelClasses="blue"
                componentID="b-s2-scout"
                tooltip={false}
              />
            </div>
            <div className="admin__form--row">
              <TeamScoutAssigner
                selectValues={this.state.teams}
                getFieldDecorator={getFieldDecorator}
                formLabel="S3 Team"
                labelClasses="blue"
                componentID="b-s3-team"
                tooltip={false}
              />
              <TeamScoutAssigner
                selectValues={this.state.users}
                getFieldDecorator={getFieldDecorator}
                formLabel="S3 Scout"
                labelClasses="blue"
                componentID="b-s3-scout"
                tooltip={false}
              />
            </div>
          </div>
        </div>
        <Form.Item>
          <Button
            className="admin__form--submit"
            type="primary"
            htmlType="submit"
          >
            Assign
          </Button>
        </Form.Item>
      </Form>
    );
  }
}

export default Form.create<IProps & FormComponentProps>({ name: "" })(Admin);
