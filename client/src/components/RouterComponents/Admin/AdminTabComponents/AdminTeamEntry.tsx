import * as React from 'react';
import { Component } from 'react';

import { Form, Input, InputNumber, Button, message } from 'antd';

import RequestHandler from '../../../../classes/RequestHandler';

interface IProps {
    requestHandler: RequestHandler;
}

/**
 * Component for entering a new team into the database
 */
class AdminTeamEntry extends Component<IProps> {
    constructor(props: IProps) {
        super(props);
    }

    handleSubmit = (values: any) => {
        this.props.requestHandler
            .post('/teams', values)
            .then((_res) => {
                message.success(
                    `Team ${values.teamNumber} was successfully created`
                );
            })
            .catch((_err) => {
                message.error(
                    `Something went wrong. Is team ${values.teamNumber} already in use?`
                );
            });
    };

    render() {
        return (
            <Form onFinish={this.handleSubmit}>
                {/* Team number field */}
                <Form.Item
                    label="Team Number:"
                    rules={[
                        {
                            required: true,
                            message: 'The team number is required',
                        },
                        {
                            type: 'number',
                            min: 1,
                            max: 999999,
                            message: 'The team number must be an integer >= 1',
                        },
                    ]}
                    name="teamNumber"
                >
                    <InputNumber />
                </Form.Item>
                {/* Team name field */}
                <Form.Item
                    label="Team Name:"
                    rules={[
                        {
                            required: true,
                            message: 'The team name is required!',
                        },
                    ]}
                    name="teamName"
                >
                    <Input />
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

export default AdminTeamEntry;
