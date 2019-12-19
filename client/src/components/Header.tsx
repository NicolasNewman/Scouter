import * as React from "react";
import { Component } from "react";

interface IProps {}

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
          <p>Login</p>
        </div>
      </div>
    );
  }
}
