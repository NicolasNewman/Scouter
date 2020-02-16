import * as React from "react";
import { Component } from "react";

export interface IGridElementProps {
  gridAreaName?: string;
  // [other: string]: any;
}

export interface IGridProps extends IGridElementProps {
  templateArea: string;
  cols: string;
  rows: string;
  gridElements: Array<React.ReactElement<IGridElementProps | any>>;
  className?: string;
}

// interface IProps {
//   templateArea: string;
//   cols: string;
//   rows: string;
//   gridGroup: Array<React.ReactElement<IGridGroupProps | any>>;
// }

export default class Grid extends Component<IGridProps> {
  props: IGridProps;

  constructor(props: IGridProps) {
    super(props);
  }
  render() {
    return (
      <div
        className={this.props.className}
        style={{
          display: "grid",
          gridTemplateColumns: this.props.cols,
          gridTemplateRows: this.props.rows,
          gridTemplateAreas: this.props.templateArea,
          gridArea: this.props.gridAreaName
        }}
      >
        {...this.props.gridElements}
      </div>
    );
  }
}
