import * as React from "react";
import { Component } from "react";

import { Icon } from "antd";

interface IProps {
  username: string;
  isAuthenticated: boolean;
}

export default class Navigation extends Component<IProps> {
  props: IProps;

  constructor(props: IProps) {
    super(props);
  }

  render() {
    console.log(this.props.username);
    //TODO authenticate if signed out
    return (
      <div className="header">
        <div className="header__title">
          <h1>Scouter</h1>
        </div>
        <div className="header__info">
          {/* <a>Login</a> */}
          <span>
            <Icon type="user" /> {this.props.username}
          </span>
        </div>
      </div>
    );
  }
}
