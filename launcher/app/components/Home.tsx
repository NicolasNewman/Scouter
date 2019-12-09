import * as React from 'react';
import { Component } from 'react';
import { RouteComponentProps } from 'react-router';
import DataStore from 'app/classes/DataStore';

import SetupForm from './SetupForm';

import { Tabs } from 'antd';
const { TabPane } = Tabs;

interface IProps extends RouteComponentProps<any> {
    dataStore: DataStore;
}

export default class Home extends Component<IProps> {
    props: IProps;
    tabKeys = {
        setup: 'SETUP',
        log: 'LOG'
    };

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Tabs defaultActiveKey={this.tabKeys.setup}>
                <TabPane tab="Setup" key={this.tabKeys.setup}>
                    <SetupForm />
                </TabPane>
                <TabPane tab="Log" key={this.tabKeys.log} disabled></TabPane>
            </Tabs>
        );
    }
}
