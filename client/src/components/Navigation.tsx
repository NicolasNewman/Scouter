import * as React from 'react';
import { Component } from 'react';
import { Link } from 'react-router-dom';
import { Menu } from 'antd';
import {
    HomeOutlined,
    FormOutlined,
    BarChartOutlined,
    ToolOutlined,
} from '@ant-design/icons';

interface IProps {
    isAdmin: boolean;
    isActive: boolean;
}

/**
 * The navigation bar used to move between pages
 *
 * This is the left hand bar on maximimzed computer browser
 */
export default class Navigation extends Component<IProps> {
    props: IProps;

    constructor(props: IProps) {
        super(props);
    }

    render() {
        return (
            <Menu mode="inline">
                <Menu.Item key="home">
                    <span>
                        {/* <Icon type="home" /> */}
                        <HomeOutlined />
                        <span>Home</span>
                    </span>
                    <Link to="/home" />
                </Menu.Item>
                <Menu.Item key="entry">
                    {' '}
                    {/* disabled={!this.props.isActive} key="entry"> */}
                    <span>
                        <FormOutlined />
                        <span>Entry</span>
                    </span>
                    <Link to="/entry" />
                </Menu.Item>
                <Menu.Item key="visualize">
                    <span>
                        <BarChartOutlined />
                        <span>Visualize</span>
                    </span>
                    <Link to="/visualize" />
                </Menu.Item>
                <Menu.Item key="admin" hidden={!this.props.isAdmin}>
                    <span>
                        <ToolOutlined />
                        <span>Admin</span>
                    </span>
                    <Link to="/admin" />
                </Menu.Item>
                {/* <Menu.Item key="debug">
          <span>
            <Icon type="bug" />
            <span>Debug</span>
          </span>
          <Link to="/debug" />
        </Menu.Item> */}
            </Menu>
        );
    }
}
