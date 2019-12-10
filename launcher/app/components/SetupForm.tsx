import * as React from 'react';
import { Component } from 'react';
import { FormComponentProps } from 'antd/lib/form/Form';
import { Form, InputNumber, Checkbox, Button, Tooltip, Icon } from 'antd';
import DataStore from 'app/classes/DataStore';

interface IProps {
    dataStore: DataStore;
    serverPort: number;
    dbPort: number;
}

/**
 * React component for the form the user enters the server's config fields into
 */
class SetupForm extends Component<IProps & FormComponentProps> {
    constructor(props: IProps & FormComponentProps) {
        super(props);
    }

    componentDidMount() {
        this.props.form.setFieldsValue({
            serverPort: this.props.serverPort,
            dbPort: this.props.dbPort
        });
    }

    handleSubmit = (e: React.SyntheticEvent): void => {
        e.preventDefault();
        this.props.form.validateFields((err, vals) => {
            console.log(vals);
            console.log(err);
            if (!err && vals.save) {
                this.props.dataStore.set('serverPort', vals.serverPort);
                this.props.dataStore.set('dbPort', vals.dbPort);
            }
        });
    };

    render() {
        const { getFieldDecorator } = this.props.form;

        return (
            <Form className="form" onSubmit={this.handleSubmit}>
                {/* Website port field */}
                <Form.Item
                    className="form__item"
                    label={
                        <span className="form__item--label">
                            Server Port
                            <Tooltip
                                className="form__item--tooltip"
                                title="The port used to connect to the web app"
                            >
                                <Icon type="question-circle" />
                            </Tooltip>
                        </span>
                    }
                >
                    {getFieldDecorator('serverPort', {
                        rules: [
                            {
                                type: 'integer',
                                message: (
                                    <p>The given port is not a valid number!</p>
                                )
                            },
                            {
                                required: true,
                                message: <p>The site port is required!</p>
                            }
                        ]
                    })(<InputNumber className="form__item--number-input" />)}
                </Form.Item>
                {/* Database port field */}
                <Form.Item
                    className="form__item"
                    label={
                        <span className="form__item--label">
                            DB Port
                            <Tooltip
                                className="form__item--tooltip"
                                title="The port used by the database"
                            >
                                <Icon type="question-circle" />
                            </Tooltip>
                        </span>
                    }
                >
                    {getFieldDecorator('dbPort', {
                        rules: [
                            {
                                type: 'integer',
                                message: (
                                    <p>The given port is not a valid number!</p>
                                )
                            },
                            {
                                required: true,
                                message: <p>The database port is required!</p>
                            }
                        ]
                    })(<InputNumber className="form__item--number-input" />)}
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
