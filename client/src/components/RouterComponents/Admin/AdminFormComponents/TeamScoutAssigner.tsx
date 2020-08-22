import * as React from 'react';

import { Form, Select, Tooltip } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
const { Option } = Select;
import { IAdminFormState } from '../../../../reducers/admin';

interface IProps {
    formLabel: string;
    labelClasses: string;
    componentID: keyof IAdminFormState;
    selectValues: Array<string>;
    tooltip: boolean;
    defaultFormValues: { [index: string]: any }; // TODO REDUX STORE
    setFormField: (field: keyof IAdminFormState, value: string) => void;
    tooltipText?: string;
}

/**
 * A sub-component of the admin assignment form that contains an input for the team/scout
 * @param props
 */

const TeamScoutAssigner: React.FC<IProps> = (props) =>
    props.componentID.includes('team') ? (
        <Form.Item
            className="admin__form--item"
            label={
                <span className={`admin__form--label ${props.labelClasses}`}>
                    {props.formLabel}
                    {props.tooltip && (
                        <Tooltip
                            className="form__item--tooltip"
                            title={props.tooltipText}
                        >
                            <QuestionCircleOutlined />
                        </Tooltip>
                    )}
                </span>
            }
            rules={[
                {
                    required: true,
                    message: 'The team number is required!',
                },
            ]}
            name={props.componentID}
            initialValue={props.defaultFormValues[props.componentID]}
        >
            {/* If the field is for a team, add a rule stating it is required */}
            <Select
                onChange={(val: string) =>
                    props.setFormField(props.componentID, val)
                }
                className="admin__form--select"
            >
                {props.selectValues.map((val) => (
                    <Option key={val} value={val}>
                        {val}
                    </Option>
                ))}
            </Select>
        </Form.Item>
    ) : (
        <Form.Item
            className="admin__form--item"
            label={
                <span className={`admin__form--label ${props.labelClasses}`}>
                    {props.formLabel}
                    {props.tooltip && (
                        <Tooltip
                            className="form__item--tooltip"
                            title={props.tooltipText}
                        >
                            <QuestionCircleOutlined />
                        </Tooltip>
                    )}
                </span>
            }
            name={props.componentID}
            initialValue={props.defaultFormValues[props.componentID]}
        >
            {/* If the field is for a team, add a rule stating it is required */}
            <Select
                onChange={(val: string) =>
                    props.setFormField(props.componentID, val)
                }
                className="admin__form--select"
            >
                {props.selectValues.map((val) => (
                    <Option key={val} value={val}>
                        {val}
                    </Option>
                ))}
            </Select>
        </Form.Item>
    );

export default TeamScoutAssigner;
