import * as React from 'react';
import { Component } from 'react';
import { FormComponentProps } from 'antd/lib/form/Form';
import {
    Form,
    // InputNumber,
    Checkbox,
    Button,
    Tooltip,
    Icon,
    // Select,
    // Upload,
    Input
} from 'antd';
// const { Option } = Select;

import DataStore from 'app/classes/DataStore';

interface IProps {
    dataStore: DataStore;
    serverPort: number;
    dbPort: number;
    mode: 'form' | 'timeseries';
    updateFormState: (
        serverPort: number,
        dbPort: number,
        dbName: string,
        adminPassword: string,
        mode: 'form' | 'timeseries'
    ) => void;
    handleFormSubmit: () => void;
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
            dbPort: this.props.dbPort,
            mode: this.props.mode
        });
    }

    handleSubmit = (e: React.SyntheticEvent): void => {
        e.preventDefault();
        this.props.form.validateFields((err, vals) => {
            console.log(vals);
            console.log(err);
            if (!err && vals.save) {
                // console.log('serverPort');
                // this.props.dataStore.set('serverPort', vals.serverPort);
                // console.log('dbPort');
                // this.props.dataStore.set('dbPort', vals.dbPort);
                // console.log('dbName');
                this.props.dataStore.set('dbName', vals.dbName);
                this.props.dataStore.set('adminPassword', vals.adminPassword);
                // this.props.dataStore.set('mode', 'vals.mode');
            }

            if (!err) {
                this.props.updateFormState(
                    vals.serverPort,
                    vals.dbPort,
                    vals.dbName,
                    vals.adminPassword,
                    vals.mode
                );
                this.props.handleFormSubmit();
            }
        });
    };

    validateModules = async (rule, value, callback) => {
        console.log(rule);
        console.log(value);
        let i = 0;
        const requiredFiles = ['dbModel.ts', 'formModel.ts', 'graphModel.ts'];
        const foundFiles = [];
        value.fileList.forEach(file => {
            i++;
            foundFiles.push(file.name);
            if (i > 3) {
                callback('Exactly 3 files should be uploaded');
            }
        });
        let isFileMissing = false;
        let fileMissingCallbackMsg = 'The following files are missing:';
        requiredFiles.forEach(file => {
            if (!foundFiles.includes(file)) {
                isFileMissing = true;
                fileMissingCallbackMsg =
                    fileMissingCallbackMsg + ' ' + file + ',';
            }
        });
        if (isFileMissing) {
            fileMissingCallbackMsg = fileMissingCallbackMsg.substring(
                0,
                fileMissingCallbackMsg.length - 1
            );
            callback(fileMissingCallbackMsg);
        }

        callback('Test');
    };

    render() {
        const { getFieldDecorator } = this.props.form;

        return (
            <Form className="form" onSubmit={this.handleSubmit}>
                {/* Website port field */}
                {/* <Form.Item
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
                </Form.Item> */}
                {/* Database port field
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
                </Form.Item> */}
                {/* Database name field */}
                <Form.Item
                    className="form__item"
                    label={
                        <span className="form__item--label">
                            DB Name
                            <Tooltip
                                className="form__item--tooltip"
                                title="The name of the database document in MongoDB"
                            >
                                <Icon type="question-circle" />
                            </Tooltip>
                        </span>
                    }
                >
                    {getFieldDecorator('dbName', {
                        rules: [
                            {
                                required: true,
                                message: <p>The database name is required!</p>
                            }
                        ]
                    })(<Input className="form__item--number-input" />)}
                </Form.Item>
                {/* Admin password field */}
                <Form.Item
                    className="form__item"
                    label={
                        <span className="form__item--label">
                            Password
                            <Tooltip
                                className="form__item--tooltip"
                                title="The username needed to login as admin"
                            >
                                <Icon type="question-circle" />
                            </Tooltip>
                        </span>
                    }
                >
                    {getFieldDecorator('adminPassword', {
                        rules: [
                            {
                                required: true,
                                message: <p>The admin password is required!</p>
                            }
                        ]
                    })(<Input.Password className="form__item--number-input" />)}
                </Form.Item>
                {/* Mode */}
                {/* <Form.Item
                    className="form__item"
                    label={
                        <span className="form__item--label">
                            Mode
                            <Tooltip
                                className="form__item--tooltip"
                                title="The mode for how data is gathered"
                            >
                                <Icon type="question-circle" />
                            </Tooltip>
                        </span>
                    }
                >
                    {getFieldDecorator('mode', {
                        rules: [
                            {
                                required: true,
                                message: <p>The mode is required!</p>
                            }
                        ]
                    })(
                        <Select
                            className="form__item--select"
                            placeholder="Please select a mode"
                        >
                            <Option value="form">Form</Option>
                            <Option value="timeseries">Timeseries</Option>
                        </Select>
                    )}
                </Form.Item> */}
                {/* File uploader */}
                {/* <Form.Item>
                    {getFieldDecorator('moduleDragger', {
                        rules: [
                            {
                                required: true,
                                message: 'Please upload the 3 files'
                            },
                            {
                                validator: this.validateModules
                            }
                        ]
                    })(
                        <Upload.Dragger multiple={true} name="dbModel">
                            <p className="ant-upload-drag-icon">
                                <Icon type="inbox" />
                            </p>
                            <p className="ant-upload-text">
                                Click or drag modules to this area to upload
                            </p>
                            <p className="ant-upload-hint">
                                Must include:
                                <br />
                                dbModel.ts, formModel.ts, graphModel.ts
                            </p>
                        </Upload.Dragger>
                    )}
                </Form.Item>
                {/* Save checkbox & submit button */}
                <Form.Item>
                    {getFieldDecorator('save', {
                        valuePropName: 'checked'
                    })(<Checkbox>Save fields</Checkbox>)}
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
