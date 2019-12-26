import * as React from "react";
import { Component } from "react";
import { Link } from "react-router-dom";
import { Menu, Icon } from "antd";
const { SubMenu } = Menu;

interface IProps {
  isAdmin: boolean;
  isActive: boolean;
}

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
            <Icon type="home" />
            <span>Home</span>
          </span>
          <Link to="/home" />
        </Menu.Item>
        <Menu.Item disabled={!this.props.isActive} key="entry">
          <span>
            <Icon type="form" />
            <span>Entry</span>
          </span>
          <Link to="/entry" />
        </Menu.Item>
        <Menu.Item key="visualize">
          <span>
            <Icon type="bar-chart" />
            <span>Visualize</span>
          </span>
          <Link to="/visualize" />
        </Menu.Item>
        <Menu.Item key="admin" hidden={!this.props.isAdmin}>
          <span>
            <Icon type="tool" />
            <span>Admin</span>
          </span>
          <Link to="/admin" />
        </Menu.Item>
      </Menu>
    );
  }
}
