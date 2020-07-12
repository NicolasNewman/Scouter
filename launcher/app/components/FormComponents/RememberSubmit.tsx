import * as React from 'react';
import { Component, Fragment } from 'react';

import { Checkbox, Button } from 'antd';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';

interface RememberSubmitValue {
    checked: boolean;
}

interface IProps {
    btnText: string;
    checkboxText: string;
    value?: RememberSubmitValue;
    onChange?: (value: RememberSubmitValue) => void;
}

interface IState {
    checked: boolean;
}

export default class RememberSubmit extends Component<IProps, IState> {
    props: IProps;

    constructor(props: IProps) {
        super(props);
        this.state = {
            checked: false
        };
    }

    handleChange = (e: CheckboxChangeEvent) => {
        this.setState({ checked: e.target.checked });
        this.props.onChange({ checked: e.target.checked });
    };

    render() {
        return (
            <Fragment>
                <Checkbox
                    onChange={this.handleChange}
                    checked={this.state.checked}
                >
                    {this.props.checkboxText}
                </Checkbox>
                <Button type="primary" htmlType="submit">
                    {this.props.btnText}
                </Button>
            </Fragment>
        );
    }
}
