import * as React from 'react';
import { Component } from 'react';

import { UserOutlined } from '@ant-design/icons';

interface IProps {
    username: string;
    isAuthenticated: boolean;
}

/**
 * Component for the header-bar containing the app's title and user's name
 */
export default class Navigation extends Component<IProps> {
    props: IProps;

    constructor(props: IProps) {
        super(props);
    }

    render() {
        return (
            <div className="header">
                <div className="header__title">
                    <h1>Scouter</h1>
                </div>
                <div className="header__info">
                    <span>
                        <UserOutlined /> {this.props.username}
                    </span>
                </div>
            </div>
        );
    }
}
