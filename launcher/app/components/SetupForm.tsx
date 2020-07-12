import * as React from 'react';
import { Component } from 'react';

import { Form, Tooltip, Input } from 'antd';

import { QuestionCircleOutlined } from '@ant-design/icons';

import DataStore from 'app/classes/DataStore';
import { FormInstance } from 'antd/lib/form';
import ConstrainedUploader from './FormComponents/ConstrainedUploader';
import RememberSubmit from './FormComponents/RememberSubmit';

interface IProps {
    dataStore: DataStore;
    serverPort: number;
    dbName: string;
    dbPort: number;
    adminPassword: string;
    filePath: string;
    updateFormState: (
        dbName: string,
        adminPassword: string,
        filePath: string
    ) => void;
    handleFormSubmit: () => void;
}

/**
 * React component for the form the user enters the server's config fields into
 */
class SetupForm extends Component<IProps> {
    formRef: React.Ref<FormInstance>;

    constructor(props: IProps) {
        super(props);
        this.formRef = React.createRef<FormInstance>();
    }

    componentDidMount() {
        // TODO update
        // this.props.form.setFieldsValue({
        //     serverPort: this.props.serverPort,
        //     dbPort: this.props.dbPort,
        //     mode: this.props.mode
        // });
    }

    handleSubmit = (values): void => {
        console.log(values);
        const dbName = values.dbName;
        const adminPassword = values.adminPassword;
        const save = values.save.checked;
        let filePath = null;
        if (values.customModule && values.customModule.head) {
            filePath = values.customModule.head.originFileObj.path;
        }
        console.log(filePath);

        if (save) {
            this.props.dataStore.set('dbName', dbName);
            this.props.dataStore.set('adminPassword', adminPassword);
        }
        this.props.updateFormState(
            dbName,
            adminPassword,
            filePath ? filePath : ''
        );
        this.props.handleFormSubmit();
    };

    validateModules = (rule, value) => {
        if (value && value.head) {
            const fName: string = value.head.name;
            if (!fName.endsWith('.sdc')) {
                return Promise.reject('The uploaded file is not an .sdc file');
            }
        }
        return Promise.resolve();
    };

    render() {
        return (
            <Form
                className="form"
                ref={this.formRef}
                onFinish={this.handleSubmit}
                initialValues={{
                    dbName: this.props.dbName,
                    adminPassword: this.props.adminPassword
                }}
            >
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
                                <QuestionCircleOutlined />
                            </Tooltip>
                        </span>
                    }
                    name="dbName"
                    rules={[
                        {
                            required: true,
                            message: <p>The database name is required!</p>
                        }
                    ]}
                >
                    <Input className="form__item--number-input" />
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
                                <QuestionCircleOutlined />
                            </Tooltip>
                        </span>
                    }
                    name="adminPassword"
                    rules={[
                        {
                            required: true,
                            message: <p>The admin password is required!</p>
                        }
                    ]}
                >
                    <Input.Password className="form__item--number-input" />
                </Form.Item>
                {/* File uploader */}
                <Form.Item
                    name="customModule"
                    label={
                        <span className="form__item--label">
                            File
                            <Tooltip
                                className="form__item--tooltip"
                                title="If a custom form has been created, upload the .sdc file here"
                            >
                                <QuestionCircleOutlined />
                            </Tooltip>
                        </span>
                    }
                    rules={[
                        { required: false },
                        { validator: this.validateModules }
                    ]}
                >
                    <ConstrainedUploader btnText="Upload File" limit={1} />
                </Form.Item>
                {/* Save checkbox & submit button */}
                <Form.Item name="save">
                    <RememberSubmit
                        btnText="Start"
                        checkboxText="Save fields"
                    />
                </Form.Item>
            </Form>
        );
    }
}

export default SetupForm;
