import * as React from 'react';
import { Component } from 'react';

import { Form, Button, Input, message } from 'antd';
import { FormInstance } from 'antd/lib/form';
import TeamScoutAssigner from '../AdminFormComponents/TeamScoutAssigner';
import RequestHandler from '../../../../classes/RequestHandler';
import { isUnique } from '../../../../helper/helper';
import {
    SocketController,
    emitableEvents,
} from '../../../../classes/socketController';
import { IAdminFormState } from '../../../../reducers/admin';

interface IProps {
    requestHandler: RequestHandler;
    socket: SocketController;
    formState: IAdminFormState;
    setFormState: (state: IAdminFormState) => void;
    setFormField: (field: keyof IAdminFormState, value: string) => void;
    startSession: () => void;
}

/**
 * Stores the registered users and teams on the server and db. Used to populate the form
 */
interface IState {
    teams: Array<string>;
    users: Array<string>;
}

/**
 * Component for the form to assign scouts their targets
 */
class AdminForm extends Component<IProps, IState> {
    formRef: React.Ref<FormInstance>;

    constructor(props: IProps) {
        super(props);

        this.formRef = React.createRef<FormInstance>();
        this.state = {
            teams: [],
            users: [],
        };
    }

    /**
     * Sends a signal to the socket to receive the teams from the db and users registered the scouting system
     */
    async componentDidMount() {
        await this.refreshFields();
    }

    async refreshFields() {
        // Calls for the team data from the API request handler
        const data = await this.props.requestHandler.get('teams');

        // Filter out the unneeded data from the API
        const teams = data.data.data.teams;
        const teamNumbers: Array<string> = [];
        teams.forEach((team: any) => {
            teamNumbers.push(team.teamNumber);
        });

        // Send a signal to the socket to receive the connected users
        this.props.socket.emit(emitableEvents.getUsers, undefined, (users) => {
            //TODO refresh if another user connects while page is loaded
            this.setState({ users });
        });

        this.setState({
            teams: teamNumbers,
        });
    }

    handleSubmit = (values: any) => {
        this.props.setFormState(values);

        // Build an array to check if the teams and scouts are unique
        const teams = [];
        const scouts = [];
        for (let key in values) {
            if (key.includes('team')) {
                teams.push(values[key]);
            } else if (key.includes('scout')) {
                scouts.push(values[key]);
            }
        }
        if (!isUnique(teams)) {
            message.error('You have the same team selected multiple times!');
        } else if (!isUnique(scouts)) {
            message.error('You have the same scouts selected multiple times!');
        } else {
            // Emits the event so the socket can signal the clients, once they are ready,
            // the callback is triggered and the session is started
            this.props.socket.emit(
                emitableEvents.adminFormSubmited,
                values,
                (error: boolean, errorMsg?: string) => {
                    if (error) {
                        message.error(errorMsg);
                    } else {
                        this.props.startSession();
                    }
                }
            );
        }
    };

    render() {
        return (
            <Form
                ref={this.formRef}
                className="admin__form"
                onFinish={this.handleSubmit}
            >
                <Button
                    type="primary"
                    onClick={async () => {
                        await this.refreshFields();
                    }}
                >
                    Refresh
                </Button>
                <div className="admin">
                    <div className="admin__col">
                        {/* Column for the red alliance */}
                        <h1 className="admin__heading red">Red Alliance</h1>
                        <div className="admin__form--row">
                            <TeamScoutAssigner
                                selectValues={this.state.teams}
                                formLabel="S1 Team"
                                labelClasses="red"
                                componentID="r-s1-team"
                                tooltip={false}
                                defaultFormValues={this.props.formState}
                                setFormField={this.props.setFormField}
                            />
                            <TeamScoutAssigner
                                selectValues={this.state.users}
                                formLabel="S1 Scout"
                                labelClasses="red"
                                componentID="r-s1-scout"
                                tooltip={false}
                                defaultFormValues={this.props.formState}
                                setFormField={this.props.setFormField}
                            />
                        </div>
                        <div className="admin__form--row">
                            <TeamScoutAssigner
                                selectValues={this.state.teams}
                                formLabel="S2 Team"
                                labelClasses="red"
                                componentID="r-s2-team"
                                tooltip={false}
                                defaultFormValues={this.props.formState}
                                setFormField={this.props.setFormField}
                            />
                            <TeamScoutAssigner
                                selectValues={this.state.users}
                                formLabel="S2 Scout"
                                labelClasses="red"
                                componentID="r-s2-scout"
                                tooltip={false}
                                defaultFormValues={this.props.formState}
                                setFormField={this.props.setFormField}
                            />
                        </div>
                        <div className="admin__form--row">
                            <TeamScoutAssigner
                                selectValues={this.state.teams}
                                formLabel="S3 Team"
                                labelClasses="red"
                                componentID="r-s3-team"
                                tooltip={false}
                                defaultFormValues={this.props.formState}
                                setFormField={this.props.setFormField}
                            />
                            <TeamScoutAssigner
                                selectValues={this.state.users}
                                formLabel="S3 Scout"
                                labelClasses="red"
                                componentID="r-s3-scout"
                                tooltip={false}
                                defaultFormValues={this.props.formState}
                                setFormField={this.props.setFormField}
                            />
                        </div>
                    </div>
                    <div className="admin__col">
                        {/* Column for the blue alliance */}
                        <h1 className="admin__heading blue">Blue Alliance</h1>
                        <div className="admin__form--row">
                            <TeamScoutAssigner
                                selectValues={this.state.teams}
                                formLabel="S1 Team"
                                labelClasses="blue"
                                componentID="b-s1-team"
                                tooltip={false}
                                defaultFormValues={this.props.formState}
                                setFormField={this.props.setFormField}
                            />
                            <TeamScoutAssigner
                                selectValues={this.state.users}
                                formLabel="S1 Scout"
                                labelClasses="blue"
                                componentID="b-s1-scout"
                                tooltip={false}
                                defaultFormValues={this.props.formState}
                                setFormField={this.props.setFormField}
                            />
                        </div>
                        <div className="admin__form--row">
                            <TeamScoutAssigner
                                selectValues={this.state.teams}
                                formLabel="S2 Team"
                                labelClasses="blue"
                                componentID="b-s2-team"
                                tooltip={false}
                                defaultFormValues={this.props.formState}
                                setFormField={this.props.setFormField}
                            />
                            <TeamScoutAssigner
                                selectValues={this.state.users}
                                formLabel="S2 Scout"
                                labelClasses="blue"
                                componentID="b-s2-scout"
                                tooltip={false}
                                defaultFormValues={this.props.formState}
                                setFormField={this.props.setFormField}
                            />
                        </div>
                        <div className="admin__form--row">
                            <TeamScoutAssigner
                                selectValues={this.state.teams}
                                formLabel="S3 Team"
                                labelClasses="blue"
                                componentID="b-s3-team"
                                tooltip={false}
                                defaultFormValues={this.props.formState}
                                setFormField={this.props.setFormField}
                            />
                            <TeamScoutAssigner
                                selectValues={this.state.users}
                                formLabel="S3 Scout"
                                labelClasses="blue"
                                componentID="b-s3-scout"
                                tooltip={false}
                                defaultFormValues={this.props.formState}
                                setFormField={this.props.setFormField}
                            />
                        </div>
                    </div>
                </div>
                {/* Input field for the match number */}
                <Form.Item
                    className="admin__form--item-global"
                    label="Match number:"
                    name="matchNumber"
                    rules={[
                        {
                            required: true,
                            message: 'The match number is required!',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
                {/* Button to submit the form */}
                <Form.Item>
                    <Button
                        className="admin__form--submit"
                        type="primary"
                        htmlType="submit"
                    >
                        Assign
                    </Button>
                </Form.Item>
            </Form>
        );
    }
}

export default AdminForm;
