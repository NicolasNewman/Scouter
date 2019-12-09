import * as React from 'react';
import { Component } from 'react';
import { FormComponentProps } from 'antd/lib/form/Form';
import { Form, Input, Checkbox, Button, Tooltip, Icon } from 'antd';

interface IProps {}

class SetupForm extends Component<IProps & FormComponentProps> {
    constructor(props: IProps & FormComponentProps) {
        super(props);
    }

    handleSubmit = (e): void => {};

    render() {
        const { getFieldDecorator } = this.props.form;

        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 8 }
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 16 }
            }
        };

        return (
            <Form {...formItemLayout} onSubmit={this.handleSubmit}>
                {/* Website port field */}
                <Form.Item
                    label={
                        <span>
                            Site Port
                            <Tooltip title="The port used to connect to the webserver">
                                <Icon type="question-circle" />
                            </Tooltip>
                        </span>
                    }
                >
                    {getFieldDecorator('sitePort', {
                        rules: [
                            {
                                type: 'number',
                                message: 'The given port is not a valid number'
                            },
                            {
                                required: true,
                                message: 'The site port is required'
                            }
                        ]
                    })(<Input />)}
                </Form.Item>
                {/* Database port field */}
                <Form.Item
                    label={
                        <span>
                            DB Port
                            <Tooltip title="The port used by the database">
                                <Icon type="question-circle" />
                            </Tooltip>
                        </span>
                    }
                >
                    {getFieldDecorator('dbPort', {
                        rules: [
                            {
                                type: 'number',
                                message: 'The given port is not a valid number'
                            },
                            {
                                required: true,
                                message: 'The database port is required'
                            }
                        ]
                    })(<Input />)}
                </Form.Item>
                {/* Save checkbox */}
                <Form.Item>
                    {getFieldDecorator('save', {
                        valuePropName: 'checked'
                    })(<Checkbox>Save fields</Checkbox>)}
                </Form.Item>
                {/* Submit button */}
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Start
                    </Button>
                </Form.Item>
            </Form>
        );
    }
}

export default Form.create<IProps & FormComponentProps>({ name: 'setup' })(
    SetupForm
);
