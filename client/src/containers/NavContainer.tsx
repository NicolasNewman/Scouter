import * as React from "react";
import { Component } from "react";
import Navigation from "../components/Navigation";

interface IProps {
  rightComponent: React.ReactType;
}

// export const BaseComponent: React.FC<IBaseComponent> = props => {
export default class BaseComponent extends Component<IProps> {
  props: IProps;

  constructor(props: IProps) {
    super(props);
  }

  render() {
    const RightComponent = this.props.rightComponent;
    return (
      <div className="two-col-nav">
        <div className="two-col-nav__left">
          <Navigation />
        </div>
        <div className="two-col-nav__right">
          <RightComponent />
        </div>
      </div>
    );
  }
}
