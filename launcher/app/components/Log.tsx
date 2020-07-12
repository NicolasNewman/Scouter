import * as React from 'react';
import { Component } from 'react';
import { Input, Button } from 'antd';

import ResourceManager from '../classes/ResourceManager';
import ScriptExecutor from '../classes/ScriptExecutor';
import { writeEnv } from '../helper/helper';
import * as fs from 'fs';
import * as path from 'path';

const { TextArea } = Input;
interface IProps {
    serverPort: number;
    dbPort: number;
    dbName: string;
    adminPassword: string;
    filePath: string;
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
        const clientPath = manager.getLocations().CLIENT.CUSTOM;
        const globalPath = manager.getLocations().GLOBAL;
        console.log(clientPath);
        console.log(globalPath);

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
                // 2) Inject the custom modules if they exist
                if (this.props.filePath !== '') {
                    this.props.logEvent(
                        `Compiling the Form code from ${this.props.filePath}`
                    );
                    const code = fs.readFileSync(this.props.filePath, 'utf8');
                    const modules = code.split('$#$');
                    if (modules.length !== 4) {
                        this.props.logEvent(
                            'Something is wrong with the loaded file. Please try re-generating it through Scouter Design'
                        );
                    } else {
                        const form = `const module = \`${Buffer.from(
                            modules[0],
                            'base64'
                        ).toString('utf-8')}\`;\nexport default module;`;
                        const type = `const module = \`${Buffer.from(
                            modules[1],
                            'base64'
                        ).toString('utf-8')}\`;\nexport default module;`;
                        const accuracy = `const module = \`${Buffer.from(
                            modules[2],
                            'base64'
                        ).toString('utf-8')}\`;\nexport default module;`;
                        const score = `const module = \`${Buffer.from(
                            modules[3],
                            'base64'
                        ).toString('utf-8')}\`;\nexport default module;`;

                        this.props.logEvent('Writing form code to file...');

                        manager.write(
                            path.join(clientPath, 'C_DataInput.tsx'),
                            form
                        );
                        manager.write(
                            path.join(globalPath, 'C_gameTypes.ts'),
                            type
                        );
                        manager.write(
                            path.join(globalPath, 'C_accuracyResolver.ts'),
                            accuracy
                        );
                        manager.write(
                            path.join(globalPath, 'C_soureResolver.ts'),
                            score
                        );

                        this.props.logEvent('Done');
                    }
                } else {
                    const emptyExport = `const module = \`\`;\nexport default module;`;

                    manager.write(
                        path.join(clientPath, 'C_DataInput.tsx'),
                        emptyExport
                    );
                    manager.write(
                        path.join(globalPath, 'C_gameTypes.ts'),
                        emptyExport
                    );
                    manager.write(
                        path.join(globalPath, 'C_accuracyResolver.ts'),
                        emptyExport
                    );
                    manager.write(
                        path.join(globalPath, 'C_soureResolver.ts'),
                        emptyExport
                    );
                }
                this.props.logEvent('Building the server...');
                // 3) Build the server
                const buildExecutor = new ScriptExecutor(
                    SCRIPTS.build,
                    { shell: true, detached: true },
                    data => {}
                );
                await buildExecutor.executeAndWait();
                this.props.logEvent('Done');

                // 4) Run the server
                this.props.logEvent('Starting the server...');
                const runExecutor = new ScriptExecutor(
                    SCRIPTS.run,
                    { shell: true, detached: true },
                    data => {}
                );
                await runExecutor.executeAndWait();
                this.props.logEvent('The server has shutdown');
            }
        } else {
            this.props.logEvent('In development, testing code...');
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
                        type="primary"
                        danger
                    >
                        Stop
                    </Button>
                </div>
            </div>
        );
    }
}
