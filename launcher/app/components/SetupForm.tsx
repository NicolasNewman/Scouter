import * as React from 'react';
import { Component } from 'react';
import { FormComponentProps } from 'antd/lib/form/Form';
import {
    Form,
    InputNumber,
    Checkbox,
    Button,
    Tooltip,
    Icon,
    Upload
} from 'antd';
import DataStore from 'app/classes/DataStore';

interface IProps {
    dataStore: DataStore;
    serverPort: number;
    dbPort: number;
    updateFormState: (serverPort: number, dbPort: number) => void;
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
            if (!err) {
                this.props.updateFormState(vals.serverPort, vals.dbPort);
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
                {/* File uploader */}
                <Form.Item>
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
