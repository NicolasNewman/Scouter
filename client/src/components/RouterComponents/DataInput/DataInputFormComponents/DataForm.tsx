import * as React from "react";
import { Component } from "react";

import { Form, Input, Button, message } from "antd";
import { FormComponentProps } from "antd/lib/form";
import {
  SocketController,
  emitableEvents
} from "../../../../classes/socketController";
import RequestHandler from "../../../../classes/RequestHandler";

interface IProps {
  team: string;
  alliance: "red" | "blue";
  seed: "s1" | "s2" | "s3";
  matchNumber: number;
  socket: SocketController;
  requestHandler: RequestHandler;
  removeScoutingTarget: (target: string) => void;
  setMatchData: () => void;
}

class DataForm extends Component<IProps & FormComponentProps> {
  constructor(props: IProps & FormComponentProps) {
    super(props);
  }

  handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    console.log(e);
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log(values);
        const identifier = `${this.props.alliance === "red" ? "r" : "b"}-${
          this.props.seed
        }-scout`;
        this.props.socket.emit(emitableEvents.scoutingFormSubmited, identifier);
        // /:matchNumber/:alliance/:seed/:teamNumber/match

        this.props.requestHandler
          .post(
            `${this.props.matchNumber}/${this.props.alliance}/${this.props.seed}/${this.props.team}/match`,
            values
          )
          .then(_data => {
            message.info("Match data sent successfully!");
            console.log(`removeScoutingTarget is`);
            console.log(this.props.removeScoutingTarget);
            console.log(`Team is ${this.props.team}`);

            this.props.removeScoutingTarget(this.props.team);
            this.props.setMatchData();
          });
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form className="data__form" onSubmit={this.handleSubmit}>
        <Form.Item label="Cargo Ship Hatches:">
          {getFieldDecorator("csHatch", {})(<Input />)}
        </Form.Item>
        <Form.Item label="Cargo Ship Cargo:">
          {getFieldDecorator("csCargo", {})(<Input />)}
        </Form.Item>
        <Form.Item label="Rocket L1 Hatches:">
          {getFieldDecorator("r1Hatch", {})(<Input />)}
        </Form.Item>
        <Form.Item label="Rocket L2 Hatches:">
          {getFieldDecorator("r2Hatch", {})(<Input />)}
        </Form.Item>
        <Form.Item label="Rocket L3 Hatches:">
          {getFieldDecorator("r3Hatch", {})(<Input />)}
        </Form.Item>
        <Form.Item label="Rocket L1 Cargo:">
          {getFieldDecorator("r1Cargo", {})(<Input />)}
        </Form.Item>
        <Form.Item label="Rocket L2 Cargo:">
          {getFieldDecorator("r2Cargo", {})(<Input />)}
        </Form.Item>
        <Form.Item label="Rocket L3 Cargo:">
          {getFieldDecorator("r3Cargo", {})(<Input />)}
        </Form.Item>
        <Form.Item>
          <Button className="" type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    );
  }
}

export default Form.create<IProps & FormComponentProps>({})(DataForm);
