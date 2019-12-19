import * as React from "react";
import { Component } from "react";
import NavContainer from "./NavContainer";

import DataInput from "../components/DataInput";

interface IProps {}

export default class DataInputContainer extends Component<IProps> {
  props: IProps;

  constructor(props: IProps) {
    super(props);
  }

  render() {
    return <NavContainer rightComponent={DataInput} />;
  }
}
