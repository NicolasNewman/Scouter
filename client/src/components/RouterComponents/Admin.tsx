import * as React from "react";
import { Component } from "react";
import { FormComponentProps } from "antd/lib/form/Form";
import axios from "axios";

import { Form, Select } from "antd";
import TeamScoutAssigner from "../FormComponents/TeamScoutAssigner";
import RequestHandler from "../../classes/RequestHandler";

interface IProps {
  requestHandler: RequestHandler;
}

interface IState {
  teams: Array<string>;
}

class Admin extends Component<IProps & FormComponentProps, IState> {
  constructor(props: IProps & FormComponentProps) {
    super(props);
    this.state = {
      teams: []
    };
  }

  async componentDidMount() {
    const data = await this.props.requestHandler.get("teams");

    const teams = data.data.data.teams;
    const teamNumbers: Array<string> = [];
    teams.forEach((team: any) => {
      teamNumbers.push(team.teamNumber);
    });
    this.setState({
      teams: teamNumbers
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form className="admin__form">
        <div className="admin">
          <div className="admin__col">
            <h1 className="admin__heading--red">Red Alliance</h1>
            <div className="admin__form--row">
              <TeamScoutAssigner
                selectValues={this.state.teams}
                getFieldDecorator={getFieldDecorator}
                formLabel="S1 Team"
                componentID="r-s1-team"
                tooltip={false}
              />
              <TeamScoutAssigner
                selectValues={["1", "2"]}
                getFieldDecorator={getFieldDecorator}
                formLabel="S1 Scout"
                componentID="r-s1-scout"
                tooltip={false}
              />
            </div>
          </div>
          <div className="admin__col">
            <h1 className="admin__heading--blue">Blue Alliance</h1>
          </div>
        </div>
      </Form>
    );
  }
}

export default Form.create<IProps & FormComponentProps>({ name: "" })(Admin);
