import * as React from "react";
import { Component } from "react";
// import { BaseComponent } from "./BaseComponent";

interface IProps {}

export default class Home extends Component<IProps> {
  props: IProps;

  constructor(props: IProps) {
    super(props);
  }

  render() {
    return (
      <div>
        <p>Super secret admin page!</p>
      </div>
    );
  }
}
