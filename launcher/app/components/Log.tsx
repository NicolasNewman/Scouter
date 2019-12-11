import * as React from 'react';
import { Component } from 'react';
import { Input } from 'antd';

const { TextArea } = Input;
interface IProps {}

export default class Log extends Component<IProps> {
    props: IProps;

    constructor(props) {
        super(props);
    }

    render() {
        return <TextArea autoSize={{ minRows: 14 }} />;
    }
}
