import * as React from 'react';
import { Component } from 'react';
import { Icon } from 'antd';

interface IProps {
    isAdmin: boolean;
}

export default class Home extends Component<IProps> {
    props: IProps;

    constructor(props: IProps) {
        super(props);
    }

    render() {
        return (
            <div>
                <h1>Scouter</h1>
                {this.props.isAdmin ? (
                    <p>
                        Welcome to Scouter! When you are ready to have your
                        scouts begin entering data for a match, head to the
                        Admin tab
                        <span style={{ margin: '0 0.25rem' }}>
                            (<Icon type="tool" />)
                        </span>{' '}
                        to assign your scouts to a team
                    </p>
                ) : (
                    <p>
                        Welcome to Scouter! When your lead scout is ready, the
                        Entry tab
                        <span style={{ margin: '0 0.25rem' }}>
                            (<Icon type="form" />)
                        </span>
                        will be enabled and you can begin scouting.
                    </p>
                )}
                <p>
                    If you'd like to download the match data, click{' '}
                    <a href="/data/download">here</a>
                </p>
            </div>
        );
    }
}
