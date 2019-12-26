import * as React from "react";
import { Component } from "react";

import { Form, Select, Tooltip, Icon } from "antd";
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
    return <Form className="data__form" onSubmit={this.handleSubmit}></Form>;
  }
}

export default Form.create<IProps & FormComponentProps>({})(DataForm);
