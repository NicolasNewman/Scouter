// import * as React from "react";
// import { Component } from "react";

// import { Button } from "antd";

// import RequestHandler from "../../../classes/RequestHandler";
// import { RobotState, StateTypes } from "../../../types/gameTypes";

// interface IProps {
//   label: string;
//   handler: RequestHandler;
//   buttonType: "STATE" | "EVENT";
//   stateType?: StateTypes;
// }

// interface IState {
//   clicked: boolean;
//   state?: RobotState;
// }

// export default class ScouterButton extends Component<IProps, IState> {
//   constructor(props: IProps) {
//     super(props);

//     if (this.props.buttonType === "STATE" && this.props.stateType) {
//       this.state = {
//         clicked: false,
//         state: {
//           type: this.props.stateType
//         }
//       };
//     } else {
//       this.state = {
//         clicked: false
//       };
//     }
//   }

//   clicked = () => {};

//   render() {
//     return <Button onClick={this.clicked}>{this.props.label}</Button>;
//   }
// }
