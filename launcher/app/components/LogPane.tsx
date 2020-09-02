import * as React from 'react';
import { Component } from 'react';
// import { Input, Button, Tabs } from 'antd';
import { Button, Tabs } from 'antd';
import { networkInterfaces } from 'os';
import Log from './Log';
import { Logs } from '../reducers/log';
import ResourceManager from '../classes/ResourceManager';
import ScriptExecutor from '../classes/ScriptExecutor';
import DHCP from '../classes/DHCP';
import { writeEnv } from '../helper/helper';
import * as fs from 'fs';
import * as path from 'path';
import DataStore from '../classes/DataStore';

const { TabPane } = Tabs;
// const { TextArea } = Input;

interface IProps {
    dataStore: DataStore;
    serverPort: number;
    dbPort: number;
    dbName: string;
    adminPassword: string;
    filePath: string;
    logs: Logs;
    logEvent: (name: string, text: string, level: 'MESSAGE' | 'WARNING' | 'ERROR') => void;
    createLog: (name: string) => void;
    deleteLog: (name: string) => void;
}

interface IState {
    startDisabled: boolean;
    stopDisabled: boolean;
}

export default class LogPane extends Component<IProps, IState> {
    props: IProps;
    state: IState;
    dhcpServer: DHCP;
    userLogName: string;

    constructor(props) {
        super(props);
        this.userLogName = 'Primary';
        this.props.createLog(this.userLogName);
        this.props.logEvent(this.userLogName, 'Click "Start" to compile the server', 'MESSAGE');
        this.state = {
            startDisabled: false,
            stopDisabled: true
        };
        this.dhcpServer = new DHCP();
    }

    /**
     * Closure that creates a function for logging events with a fixed name
     * @param name - the name to assign to the function
     */
    logEventFactory = (name: string) => {
        return (text: string, level: 'MESSAGE' | 'WARNING' | 'ERROR') => {
            this.props.logEvent(name, text, level);
        };
    };

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

        this.props.logEvent(this.userLogName, 'Starting the server...', 'MESSAGE');
        // TODO remove env file from server on package
        if (process.env.NODE_ENV === 'production') {
            // 1) Check for a valid DHCP configuration
            this.props.logEvent(this.userLogName, 'Checking for a valid DHCP configuration...', 'MESSAGE');
            const interfaces = networkInterfaces();
            let found = false;
            for (let key in interfaces) {
                this.props.logEvent(this.userLogName, `Checking interface "${key}"...`, 'MESSAGE');
                interfaces[key].forEach(group => {
                    if (group.family === 'IPv4' && group.address === '192.168.0.1') {
                        this.props.logEvent(this.userLogName, 'Found adapter with IP 192.168.0.1', 'MESSAGE');
                        found = true;
                    }
                });
            }

            if (!found) {
                this.props.logEvent(
                    this.userLogName,
                    'Could not find adapter with static IP 192.168.0.1. Scouter will not be able to be accessed from other devices',
                    'WARNING'
                );
            } else {
                this.props.logEvent(this.userLogName, 'Starting DHCP server...', 'MESSAGE');
                this.dhcpServer.start();
            }

            // 2) Update the env file with the form fields
            this.props.logEvent(this.userLogName, 'Writing the form fields to the server env file...', 'MESSAGE');
            const res = await writeEnv(this.props.dbPort, this.props.dbName, this.props.adminPassword);

            if (res.error) {
                this.props.logEvent(this.userLogName, `Error: ${res.errorMsg}`, 'ERROR');
            } else {
                this.props.logEvent(this.userLogName, 'Done', 'MESSAGE');
                let shouldRebuild = true;
                // 3) Inject the custom modules if they exist
                if (this.props.filePath !== '') {
                    this.props.logEvent(
                        this.userLogName,
                        `Compiling the form code from ${this.props.filePath}`,
                        'MESSAGE'
                    );
                    const code = fs.readFileSync(this.props.filePath, 'utf8');
                    const modules = code.split('$#$');
                    if (modules.length !== 4) {
                        this.props.logEvent(
                            this.userLogName,
                            'Something is wrong with the loaded file. Please try re-generating it through Scouter Design',
                            'ERROR'
                        );
                    } else {
                        const form = `${Buffer.from(modules[0], 'base64').toString('utf-8')}`;
                        const type = `${Buffer.from(modules[1], 'base64').toString('utf-8')}`;
                        const accuracy = `${Buffer.from(modules[2], 'base64').toString('utf-8')}`;
                        const score = `${Buffer.from(modules[3], 'base64').toString('utf-8')}`;

                        this.props.logEvent(this.userLogName, 'Writing form code to file...', 'MESSAGE');

                        manager.write(path.join(clientPath, 'DataInput.tsx'), form);
                        manager.write(path.join(globalPath, 'gameTypes.ts'), type);
                        manager.write(path.join(globalPath, 'accuracyResolver.ts'), accuracy);
                        manager.write(path.join(globalPath, 'soureResolver.ts'), score);

                        this.props.logEvent(this.userLogName, 'Done', 'MESSAGE');
                        this.props.dataStore.set('lastUsedCustom', true);
                        this.props.dataStore.set('lastBuildDefault', false);
                    }
                } else {
                    // Determine if the server needs to be re-built
                    if (
                        this.props.dataStore.get('lastUsedCustom') === false &&
                        this.props.dataStore.get('lastBuildDefault') === true
                    ) {
                        shouldRebuild = false;
                    }
                    this.props.logEvent(this.userLogName, 'Reloading default form code', 'MESSAGE');

                    const form = fs.readFileSync(path.join(clientPath, 'D_DataInput.tsx')).toString();
                    const type = fs.readFileSync(path.join(globalPath, 'D_gameTypes.ts')).toString();
                    const accuracy = fs.readFileSync(path.join(globalPath, 'D_accuracyResolver.ts')).toString();
                    const score = fs.readFileSync(path.join(globalPath, 'D_scoreResolver.ts')).toString();

                    manager.write(path.join(clientPath, 'DataInput.tsx'), form);
                    manager.write(path.join(globalPath, 'gameTypes.ts'), type);
                    manager.write(path.join(globalPath, 'accuracyResolver.ts'), accuracy);
                    manager.write(path.join(globalPath, 'soureResolver.ts'), score);
                    this.props.dataStore.set('lastUsedCustom', false);
                    this.props.dataStore.set('lastBuildDefault', true);
                }

                try {
                    this.props.logEvent(
                        this.userLogName,
                        `The server ${shouldRebuild ? 'needs to be' : "doesn't need to be"} rebuilt`,
                        'MESSAGE'
                    );
                    if (shouldRebuild) {
                        this.props.logEvent(this.userLogName, 'Building the server...', 'MESSAGE');
                        // 4) Build the server
                        const buildExecutor = new ScriptExecutor(
                            SCRIPTS.build,
                            {
                                shell: true,
                                detached: false
                            },
                            this.logEventFactory('Build')
                        );
                        await buildExecutor.executeAndWait();
                        this.props.logEvent(this.userLogName, 'Done', 'MESSAGE');
                    }

                    // 5) Start mongod
                    const mongodExecutor = new ScriptExecutor(
                        SCRIPTS.mongod,
                        {
                            shell: true,
                            detached: false
                        },
                        this.logEventFactory('MongoDB')
                    );
                    const mongodProcess = mongodExecutor.execute();

                    // 6) Run the server
                    this.props.logEvent(this.userLogName, 'Starting the server...', 'MESSAGE');
                    const runExecutor = new ScriptExecutor(
                        SCRIPTS.run,
                        {
                            shell: true,
                            detached: false
                        },
                        this.logEventFactory('Server')
                    );
                    await runExecutor.executeAndWait();

                    this.props.logEvent(this.userLogName, 'The server has shutdown', 'MESSAGE');
                    mongodProcess.kill('SIGQUIT');
                } catch (err) {
                    this.props.logEvent(this.userLogName, 'An error was received:', 'ERROR');
                    this.props.logEvent(this.userLogName, err, 'ERROR');
                }
            }
        } else {
            this.props.logEvent(this.userLogName, 'In development, testing code...', 'MESSAGE');
            this.props.logEvent(this.userLogName, 'This is a warning message', 'WARNING');
            this.props.logEvent(this.userLogName, 'This is an error message', 'ERROR');
            const runExecutor = new ScriptExecutor(
                SCRIPTS.test,
                {
                    shell: true,
                    detached: false
                },
                this.logEventFactory('Dev-Mongo')
            );
            await runExecutor.executeAndWait();
            // const runExecutor = new ScriptExecutor(SCRIPTS.run, {
            //     shell: false,
            //     detached: false
            // });
            // try {
            //     await runExecutor.executeAndWait();
            // } catch (err) {
            //     this.props.logEvent(this.userLogName, 'An error was received:', 'MESSAGE');
            //     this.props.logEvent(this.userLogName, err, 'MESSAGE');
            // }
        }
    };

    stopClicked = (e): void => {
        // this.props.logEvent('Stoping the server...');
        this.dhcpServer.stop();
    };

    render() {
        return (
            <div className="log">
                <Tabs tabPosition="left">
                    {(() => {
                        const logJSX = [];
                        for (let key in this.props.logs) {
                            logJSX.push(
                                <TabPane tab={key} key={key}>
                                    <Log events={this.props.logs[key]} />
                                </TabPane>
                            );
                        }
                        return logJSX;
                    })()}
                    {/* <TabPane tab="Log" key="Primary">
                        <Log text={'Hello'} />
                    </TabPane> */}
                </Tabs>
                <div className="log__button-row">
                    <Button className="log__button" onClick={this.startClicked} type="primary">
                        Start
                    </Button>
                    <Button className="log__button" onClick={this.startClicked} type="primary">
                        Stop
                    </Button>
                </div>
                {/* <TextArea value={this.props.logText} autoSize={{ minRows: 16, maxRows: 16 }} /> */}
                {/* <div className="log__button-row">
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
                </div> */}
            </div>
        );
    }
}
