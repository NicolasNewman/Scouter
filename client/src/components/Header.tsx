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
        <p>Scouter</p>
      </div>
    );
  }
}
