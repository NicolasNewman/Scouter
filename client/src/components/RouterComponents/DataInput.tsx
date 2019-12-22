import * as React from "react";
import { Component } from "react";

interface IProps {}

export default class Home extends Component<IProps> {
  props: IProps;

  constructor(props: IProps) {
    super(props);
  }

  render() {
    return (
      <div>
        <p>Bonjour!</p>
      </div>
    );
  }
}
