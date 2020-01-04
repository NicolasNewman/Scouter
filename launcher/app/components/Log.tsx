import * as React from 'react';
import { Component } from 'react';
import { Input, Button } from 'antd';

import ResourceManager from '../classes/ResourceManager';
import ScriptExecutor from '../classes/ScriptExecutor';
import { writeEnv } from '../helper/helper';

const { TextArea } = Input;
interface IProps {
    serverPort: number;
    dbPort: number;
    dbName: string;
    adminPassword: string;
    logText: string;
    logEvent: (event: string) => void;
}

interface IState {
    startDisabled: boolean;
    stopDisabled: boolean;
}

export default class Log extends Component<IProps, IState> {
    props: IProps;
    state: IState;

    constructor(props) {
        super(props);
        this.props.logEvent('Click "Start" to compile the server');
        this.state = {
            startDisabled: false,
            stopDisabled: true
        };
    }

    startClicked = async e => {
        const platform = (() => {
            switch (process.platform) {
                case 'linux':
                    return 'UNIX';
                case 'darwin':
                    return 'UNIX';
                case 'win32':
                    return 'WIN';
                default:
                    return undefined;
            }
        })();
        const manager = new ResourceManager(platform);
        const SCRIPTS = manager.getScripts();
        this.props.logEvent('Starting the server...');
        // TODO remove env file from server on package
        if (process.env.NODE_ENV === 'production') {
            // 1) Update the env file with the form fields
            this.props.logEvent(
                'Writing the form fields to the server env file...'
            );
            const res = await writeEnv(
                this.props.dbPort,
                this.props.dbName,
                this.props.adminPassword
            );

            if (res.error) {
                this.props.logEvent(`Error: ${res.errorMsg}`);
            } else {
                this.props.logEvent('Done');
                this.props.logEvent('Building the server...');
                // 2) Build the server
                const executor = await new ScriptExecutor(
                    SCRIPTS.build,
                    { shell: true, detached: true },
                    data => {}
                );
                await executor.executeAndWait();
                this.props.logEvent('Done');
            }
        }
    };

    stopClicked = (e): void => {
        this.props.logEvent('Stoping the server...');
    };

    render() {
        return (
            <div className="log">
                <TextArea
                    value={this.props.logText}
                    autoSize={{ minRows: 18 }}
                />
                <div className="log__button-row">
                    <Button
                        className="log__button"
                        disabled={this.state.startDisabled}
                        onClick={this.startClicked}
                        type="primary"
                    >
                        Start
                    </Button>
                    <Button
                        className="log__button"
                        disabled={this.state.stopDisabled}
                        onClick={this.stopClicked}
                        type="danger"
                    >
                        Stop
                    </Button>
                </div>
            </div>
        );
    }
}
