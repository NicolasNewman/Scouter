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
        this.props.logEvent('Ready');
        this.state = {
            startDisabled: false,
            stopDisabled: true
        };
    }

    startClicked = (e): void => {};

    stopClicked = (e): void => {};

    render() {
        return (
            <div>
                <TextArea
                    value={this.props.logText}
                    autoSize={{ minRows: 14 }}
                />
                <Button
                    disabled={this.state.startDisabled}
                    onClick={this.startClicked}
                    type="primary"
                >
                    Start
                </Button>
                <Button
                    disabled={this.state.stopDisabled}
                    onClick={this.stopClicked}
                    type="danger"
                >
                    Stop
                </Button>
            </div>
        );
    }
}
