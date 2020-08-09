import * as React from 'react';
import { Component } from 'react';
import { Input, Button } from 'antd';
import { networkInterfaces } from 'os';

import ResourceManager from '../classes/ResourceManager';
import ScriptExecutor from '../classes/ScriptExecutor';
import DHCP from '../classes/DHCP';
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
    dhcpServer: DHCP;

    constructor(props) {
        super(props);
        this.props.logEvent('Click "Start" to compile the server');
        this.state = {
            startDisabled: false,
            stopDisabled: true
        };
        this.dhcpServer = new DHCP();
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
        const globalPath = manager.getLocations().GLOBAL.GLOBAL;
        console.log(clientPath);
        console.log(globalPath);

        this.props.logEvent('Starting the server...');
        // TODO remove env file from server on package
        if (process.env.NODE_ENV === 'production') {
            // 1) Check for a valid DHCP configuration
            this.props.logEvent('Checking for a valid DHCP configuration...');
            const interfaces = networkInterfaces();
            let found = false;
            for (let key in interfaces) {
                this.props.logEvent(`Checking interface "${key}"...`);
                interfaces[key].forEach(group => {
                    if (group.family === 'IPv4' && group.address === '192.168.0.1') {
                        this.props.logEvent('Found adapter with IP 192.168.0.1');
                        found = true;
                    }
                });
            }

            if (!found) {
                this.props.logEvent(
                    'Could not find adapter with static IP 192.168.0.1. Scouter will not be able to be accessed from other devices'
                );
            } else {
                this.props.logEvent('Starting DHCP server...');
                this.dhcpServer.start();
            }

            // 2) Update the env file with the form fields
            this.props.logEvent('Writing the form fields to the server env file...');
            const res = await writeEnv(this.props.dbPort, this.props.dbName, this.props.adminPassword);

            if (res.error) {
                this.props.logEvent(`Error: ${res.errorMsg}`);
            } else {
                this.props.logEvent('Done');
                // 3) Inject the custom modules if they exist
                if (this.props.filePath !== '') {
                    this.props.logEvent(`Compiling the form code from ${this.props.filePath}`);
                    const code = fs.readFileSync(this.props.filePath, 'utf8');
                    const modules = code.split('$#$');
                    if (modules.length !== 4) {
                        this.props.logEvent(
                            'Something is wrong with the loaded file. Please try re-generating it through Scouter Design'
                        );
                    } else {
                        const form = `${Buffer.from(modules[0], 'base64').toString('utf-8')}`;
                        const type = `${Buffer.from(modules[1], 'base64').toString('utf-8')}`;
                        const accuracy = `${Buffer.from(modules[2], 'base64').toString('utf-8')}`;
                        const score = `${Buffer.from(modules[3], 'base64').toString('utf-8')}`;

                        this.props.logEvent('Writing form code to file...');

                        manager.write(path.join(clientPath, 'DataInput.tsx'), form);
                        manager.write(path.join(globalPath, 'gameTypes.ts'), type);
                        manager.write(path.join(globalPath, 'accuracyResolver.ts'), accuracy);
                        manager.write(path.join(globalPath, 'soureResolver.ts'), score);

                        this.props.logEvent('Done');
                    }
                } else {
                    this.props.logEvent(`Reloading default form code`);

                    const form = fs.readFileSync(path.join(clientPath, 'D_DataInput.tsx')).toString();
                    const type = fs.readFileSync(path.join(globalPath, 'D_gameType.ts')).toString();
                    const accuracy = fs.readFileSync(path.join(globalPath, 'D_accuracyResolver.ts')).toString();
                    const score = fs.readFileSync(path.join(globalPath, 'D_scoreResolver.ts')).toString();

                    manager.write(path.join(clientPath, 'DataInput.tsx'), form);
                    manager.write(path.join(globalPath, 'gameTypes.ts'), type);
                    manager.write(path.join(globalPath, 'accuracyResolver.ts'), accuracy);
                    manager.write(path.join(globalPath, 'soureResolver.ts'), score);
                }

                try {
                    this.props.logEvent('Building the server...');
                    // 4) Build the server
                    const buildExecutor = new ScriptExecutor(SCRIPTS.build, {
                        shell: true,
                        detached: false
                    });
                    await buildExecutor.executeAndWait();
                    this.props.logEvent('Done');

                    // 5) Run the server
                    this.props.logEvent('Starting the server...');
                    const runExecutor = new ScriptExecutor(SCRIPTS.run, {
                        shell: true,
                        detached: false
                    });
                    await runExecutor.executeAndWait();
                    this.props.logEvent('The server has shutdown');
                } catch (err) {
                    this.props.logEvent('An error was received:');
                    this.props.logEvent(err);
                }
            }
        } else {
            this.props.logEvent('In development, testing code...');
            const runExecutor = new ScriptExecutor(SCRIPTS.run, {
                shell: false,
                detached: false
            });
            try {
                await runExecutor.executeAndWait();
            } catch (err) {
                this.props.logEvent('An error was received:');
                this.props.logEvent(err);
            }
        }
    };

    stopClicked = (e): void => {
        this.props.logEvent('Stoping the server...');
        this.dhcpServer.stop();
    };

    render() {
        return (
            <div className="log">
                <TextArea value={this.props.logText} autoSize={{ minRows: 16, maxRows: 16 }} />
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
