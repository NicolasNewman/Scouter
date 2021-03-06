import * as React from "react";
import { Component } from "react";
import { FormComponentProps } from "antd/lib/form/Form";

import { Form, Input, InputNumber, Button, message } from "antd";

import RequestHandler from "../../../../classes/RequestHandler";

interface IProps {
  requestHandler: RequestHandler;
}

/**
 * Component for entering a new team into the database
 */
class AdminTeamEntry extends Component<IProps & FormComponentProps> {
  constructor(props: IProps & FormComponentProps) {
    super(props);
  }

  handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        // Send a POST request to the API, signaling a team should be created
        this.props.requestHandler
          .post("/teams", values)
          .then(_res => {
            message.success(
              `Team ${values.teamNumber} was successfully created`
            );
          })
          .catch(_err => {
            message.error(
              `Something went wrong. Is team ${values.teamNumber} already in use?`
            );
          });
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;

    return (
      <Form onSubmit={this.handleSubmit}>
        {/* Team number field */}
        <Form.Item label="Team Number:">
          {getFieldDecorator("teamNumber", {
            rules: [
              { required: true, message: "The team number is required" },
              {
                type: "number",
                min: 1,
                max: 999999,
                message: "The team number must be an integer >= 1"
              }
            ]
          })(<InputNumber />)}
        </Form.Item>
        {/* Team name field */}
        <Form.Item label="Team Name:">
          {getFieldDecorator("teamName", {
            rules: [{ required: true, message: "The team name is required!" }]
          })(<Input />)}
        </Form.Item>
        {/* Submit button */}
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    );
  }
}

export default Form.create<IProps & FormComponentProps>({ name: "" })(
  AdminTeamEntry
);
