import * as React from "react";
import { Component } from "react";
import { FormComponentProps } from "antd/lib/form/Form";

import { Form, Button, Input, message } from "antd";
import TeamScoutAssigner from "../AdminFormComponents/TeamScoutAssigner";
import RequestHandler from "../../../../classes/RequestHandler";
import {
  SocketController,
  emitableEvents
} from "../../../../classes/socketController";
import { IAdminFormState } from "../../../../reducers/admin";

interface IProps {
  requestHandler: RequestHandler;
  socket: SocketController;
  formState: IAdminFormState;
  setFormState: (state: IAdminFormState) => void;
  setFormField: (field: keyof IAdminFormState, value: string) => void;
  startSession: () => void;
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
    e.preventDefault();
    console.log(e);
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.setFormState(values);
        console.log("Received values of form: ", values);
        const teams = [];
        // Verify each team is unique
        for (let key in values) {
          if (key.includes("team")) {
            teams.push(values[key]);
          }
        }
        const unique = [...new Set(teams)];
        // If not unique
        if (unique.length !== teams.length) {
          message.error("You have the same team selected multiple times!");
        } else {
          this.props.socket.emit(
            emitableEvents.adminFormSubmited,
            values,
            (error: boolean, errorMsg?: string) => {
              if (error) {
                message.error(errorMsg);
              } else {
                this.props.startSession();
              }
            }
          );
        }
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
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
                defaultFormValues={this.props.formState}
                setFormField={this.props.setFormField}
              />
              <TeamScoutAssigner
                selectValues={this.state.users}
                getFieldDecorator={getFieldDecorator}
                formLabel="S1 Scout"
                labelClasses="red"
                componentID="r-s1-scout"
                tooltip={false}
                defaultFormValues={this.props.formState}
                setFormField={this.props.setFormField}
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
                defaultFormValues={this.props.formState}
                setFormField={this.props.setFormField}
              />
              <TeamScoutAssigner
                selectValues={this.state.users}
                getFieldDecorator={getFieldDecorator}
                formLabel="S2 Scout"
                labelClasses="red"
                componentID="r-s2-scout"
                tooltip={false}
                defaultFormValues={this.props.formState}
                setFormField={this.props.setFormField}
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
                defaultFormValues={this.props.formState}
                setFormField={this.props.setFormField}
              />
              <TeamScoutAssigner
                selectValues={this.state.users}
                getFieldDecorator={getFieldDecorator}
                formLabel="S3 Scout"
                labelClasses="red"
                componentID="r-s3-scout"
                tooltip={false}
                defaultFormValues={this.props.formState}
                setFormField={this.props.setFormField}
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
                defaultFormValues={this.props.formState}
                setFormField={this.props.setFormField}
              />
              <TeamScoutAssigner
                selectValues={this.state.users}
                getFieldDecorator={getFieldDecorator}
                formLabel="S1 Scout"
                labelClasses="blue"
                componentID="b-s1-scout"
                tooltip={false}
                defaultFormValues={this.props.formState}
                setFormField={this.props.setFormField}
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
                defaultFormValues={this.props.formState}
                setFormField={this.props.setFormField}
              />
              <TeamScoutAssigner
                selectValues={this.state.users}
                getFieldDecorator={getFieldDecorator}
                formLabel="S2 Scout"
                labelClasses="blue"
                componentID="b-s2-scout"
                tooltip={false}
                defaultFormValues={this.props.formState}
                setFormField={this.props.setFormField}
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
                defaultFormValues={this.props.formState}
                setFormField={this.props.setFormField}
              />
              <TeamScoutAssigner
                selectValues={this.state.users}
                getFieldDecorator={getFieldDecorator}
                formLabel="S3 Scout"
                labelClasses="blue"
                componentID="b-s3-scout"
                tooltip={false}
                defaultFormValues={this.props.formState}
                setFormField={this.props.setFormField}
              />
            </div>
          </div>
        </div>
        <Form.Item className="admin__form--item-global" label="Match number:">
          {getFieldDecorator("matchNumber", {
            rules: [
              {
                required: true,
                message: "The match number is required!"
              }
            ]
          })(<Input />)}
        </Form.Item>
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
