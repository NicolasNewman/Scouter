import * as React from "react";
import { Component } from "react";
import Navigation from "../components/Navigation";
import Header from "../components/Header";

interface IProps {
  rightComponent: React.ReactType;
}

// export const BaseComponent: React.FC<IBaseComponent> = props => {
export default class BaseComponent extends Component<IProps> {
  props: IProps;

  constructor(props: IProps) {
    super(props);
  }

  componentDidUpdate() {
    console.log("updated");
  }

  render() {
    const RightComponent = this.props.rightComponent;
    return (
      <div>
        <Header />
        <div className="two-col-nav">
          <div className="two-col-nav__left">
            <Navigation />
          </div>
          <div className="two-col-nav__right">
            <RightComponent />
          </div>
        </div>
      </div>
    );
  }
}
