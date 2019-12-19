import * as React from "react";
import { Component } from "react";
import NavContainer from "./NavContainer";

import Home from "../components/Home";

interface IProps {}

export default class HomeContainer extends Component<IProps> {
  props: IProps;

  constructor(props: IProps) {
    super(props);
  }

  render() {
    return <NavContainer rightComponent={Home} />;
  }
}
