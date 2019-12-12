import * as React from 'react';
import { Component } from 'react';
import { Input } from 'antd';

const { TextArea } = Input;
interface IProps {
    logText: string;
    logEvent: (event: string) => void;
}

export default class Log extends Component<IProps> {
    props: IProps;

    constructor(props) {
        super(props);
        this.props.logEvent('Ready');
    }

    render() {
        return (
            <TextArea value={this.props.logText} autoSize={{ minRows: 14 }} />
        );
    }
}
