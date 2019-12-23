import * as React from "react";
import { Component } from "react";

import { Form, Select, Tooltip, Icon } from "antd";
const { Option } = Select;
import { GetFieldDecoratorOptions } from "antd/lib/form/Form";

interface IProps {
  formLabel: string;
  labelClasses: string;
  componentID: string;
  selectValues: Array<string>;
  tooltip: boolean;
  tooltipText?: string;
  getFieldDecorator: <T extends Object = {}>(
    id: keyof T,
    options?: GetFieldDecoratorOptions | undefined
  ) => (node: React.ReactNode) => React.ReactNode;
}

const TeamScoutAssigner: React.FC<IProps> = props => (
  <Form.Item
    className="admin__form--item"
    label={
      <span className={`admin__form--label ${props.labelClasses}`}>
        {props.formLabel}
        {props.tooltip && (
          <Tooltip className="form__item--tooltip" title={props.tooltipText}>
            <Icon type="question-circle" />
          </Tooltip>
        )}
      </span>
    }
  >
    {props.componentID.includes("team")
      ? props.getFieldDecorator(props.componentID, {
          rules: [
            {
              required: true,
              message: "The team number is required!"
            }
          ]
        })(
          <Select className="admin__form--select">
            {props.selectValues.map(val => (
              <Option key={val}>{val}</Option>
            ))}
          </Select>
        )
      : props.getFieldDecorator(props.componentID, {
          rules: []
        })(
          <Select className="admin__form--select">
            {props.selectValues.map(val => (
              <Option key={val}>{val}</Option>
            ))}
          </Select>
        )}
  </Form.Item>
);

export default TeamScoutAssigner;
