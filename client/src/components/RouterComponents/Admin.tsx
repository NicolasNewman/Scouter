import * as React from "react";
import { Component } from "react";
import { FormComponentProps } from "antd/lib/form/Form";

import { Form, Select } from "antd";
import TeamScoutAssigner from "../FormComponents/TeamScoutAssigner";

interface IProps {}

class Admin extends Component<IProps & FormComponentProps> {
  constructor(props: IProps & FormComponentProps) {
    super(props);
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
                selectValues={["1", "2"]}
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
