import * as React from "react";
import { Component } from "react";

import { Icon } from "antd";

interface IProps {
  username: string;
  isAuthenticated: boolean;
}

/**
 * Component for the headerbar containing the app's title and user's name
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
            <Icon type="user" /> {this.props.username}
          </span>
        </div>
      </div>
    );
  }
}
