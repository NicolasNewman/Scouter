import * as React from "react";
import { Component } from "react";

import { Form, Select, Input, Button } from "antd";
import { FormComponentProps } from "antd/lib/form";

interface IProps {
  team: string;
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
          {getFieldDecorator("csHatch", {})(<Input />)}
        </Form.Item>
        <Form.Item label="Rocket L1 Hatches:">
          {getFieldDecorator("csHatch", {})(<Input />)}
        </Form.Item>
        <Form.Item label="Rocket L2 Hatches:">
          {getFieldDecorator("csHatch", {})(<Input />)}
        </Form.Item>
        <Form.Item label="Rocket L3 Hatches:">
          {getFieldDecorator("csHatch", {})(<Input />)}
        </Form.Item>
        <Form.Item label="Rocket L1 Cargo:">
          {getFieldDecorator("csHatch", {})(<Input />)}
        </Form.Item>
        <Form.Item label="Rocket L2 Cargo:">
          {getFieldDecorator("csHatch", {})(<Input />)}
        </Form.Item>
        <Form.Item label="Rocket L3 Cargo:">
          {getFieldDecorator("csHatch", {})(<Input />)}
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
