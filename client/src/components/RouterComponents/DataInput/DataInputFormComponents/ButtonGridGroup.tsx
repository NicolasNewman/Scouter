import * as React from "react";
import { Component } from "react";

import { Button } from "antd";

import { IGridGroupProps } from "../../../Grid/Grid";

export default class ButtonGridGroup extends Component<IGridGroupProps> {
  props: IGridGroupProps;

  constructor(props: IGridGroupProps) {
    super(props);
  }
  render() {
    return (
      <div
        style={{
          gridArea: this.props.gridAreaName
        }}
      >
        <Button>Test</Button>
      </div>
    );
  }
}
