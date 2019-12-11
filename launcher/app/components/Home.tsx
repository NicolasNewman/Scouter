import * as React from 'react';
import { Component } from 'react';
import { RouteComponentProps } from 'react-router';
import DataStore from 'app/classes/DataStore';

import SetupForm from './SetupForm';
import Log from './Log';

import { Tabs } from 'antd';
const { TabPane } = Tabs;

interface IProps extends RouteComponentProps<any> {
    dataStore: DataStore;
    serverPort: number;
    dbPort: number;
    updateFormState: (serverPort: number, dbPort: number) => void;
}

interface IState {
    formTabDisabled: boolean;
    logTabDisabled: boolean;
    currentTabKey: string;
}

export default class Home extends Component<IProps, IState> {
    props: IProps;
    state: IState;
    tabKeys = {
        setup: 'SETUP',
        log: 'LOG'
    };

    constructor(props) {
        super(props);
        this.state = {
            formTabDisabled: false,
            logTabDisabled: true,
            currentTabKey: this.tabKeys.setup
        };
    }

    /**
     * Handles events after the form is submitted successfully
     * To be called from the child form when submitted
     */
    handleFormSubmit = (): void => {
        console.log('here');
        this.setState({
            formTabDisabled: true,
            logTabDisabled: false,
            currentTabKey: this.tabKeys.log
        });
    };

    render() {
        return (
            <Tabs activeKey={this.state.currentTabKey}>
                <TabPane
                    tab="Setup"
                    key={this.tabKeys.setup}
                    disabled={this.state.formTabDisabled}
                >
                    <SetupForm
                        dataStore={this.props.dataStore}
                        serverPort={this.props.serverPort}
                        dbPort={this.props.dbPort}
                        updateFormState={this.props.updateFormState}
                        handleFormSubmit={this.handleFormSubmit}
                    />
                </TabPane>
                <TabPane
                    tab="Log"
                    key={this.tabKeys.log}
                    disabled={this.state.logTabDisabled}
                >
                    <Log />
                </TabPane>
            </Tabs>
        );
    }
}
