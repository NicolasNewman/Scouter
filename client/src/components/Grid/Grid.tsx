import * as React from "react";
import { Component } from "react";

export interface IGridGroupProps {
  gridAreaName: string;
  [other: string]: any;
}

interface IProps {
  templateArea: string;
  cols: string;
  rows: string;
  gridGroup: Array<React.ReactElement<IGridGroupProps | any>>;
}

export default class Grid extends Component<IProps> {
  props: IProps;

  constructor(props: IProps) {
    super(props);
  }
  render() {
    return (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: this.props.cols,
          gridTemplateRows: this.props.rows,
          gridTemplateAreas: this.props.templateArea
        }}
      >
        {...this.props.gridGroup}
      </div>
    );
  }
}
