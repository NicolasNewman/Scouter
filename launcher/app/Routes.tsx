import * as React from 'react';
import { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router';
import routes from './constants/routes';
import sizes from './constants/sizes';
import App from './containers/App';
import FormPage from './containers/FormPage';
import LogPage from './containers/LogPage';
import DataStore from './classes/DataStore';
import IpcInterface from './classes/IpcInterface';

export default class Routes extends Component {
    private dataStore: DataStore = new DataStore();

    render() {
        return (
            <App>
                <Switch>
                    <Route
                        path={routes.FORM}
                        component={() => {
                            IpcInterface.resizeWindow(sizes.formWindow.width, sizes.formWindow.height);
                            return <FormPage dataStore={this.dataStore} />;
                        }}
                    />
                    <Route
                        path={routes.LOG}
                        component={() => {
                            IpcInterface.resizeWindow(sizes.logWindow.width, sizes.logWindow.height);
                            return <LogPage />;
                        }}
                    />
                    <Redirect from="/" to={routes.FORM} />
                </Switch>
            </App>
        );
    }
}
