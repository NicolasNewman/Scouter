import * as React from 'react';
import { Component } from 'react';
import { Input, Button } from 'antd';

const { TextArea } = Input;
interface IProps {
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

    startClicked = (e): void => {
        this.props.logEvent('Starting the server...');
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
