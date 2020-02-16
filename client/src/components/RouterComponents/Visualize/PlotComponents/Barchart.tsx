// import * as React from "react";
// import { Component } from "react";
// import Plot from "react-plotly.js";
// import { Statistic, BarChartModes } from "../Visualize";
// import { IStatisticData, IMatch } from "../../../../reducers/data";

// interface IProps {
//   statistic: Statistic;
//   traces: Array<string>;
//   data: IStatisticData;
//   mode: BarChartModes;
//   fields: Array<keyof IMatch>;
//   teams: Array<string>;
// }

// export default class Barchart extends Component<IProps> {
//   props: IProps;
//   traces: any;

//   constructor(props: IProps) {
//     super(props);
//     console.log("IN CONSTRUCTOR");

//     // data[team][field];
//     console.log(this.props.mode);
//     console.log(this.props.traces);

//     this.generateChart();
//   }

//   generateChart = () => {
//     if (this.props.mode === BarChartModes.FIELD) {
//       this.traces = this.props.traces.map(traceName => {
//         console.log(traceName);

//         const xLabels = this.props.fields;
//         console.log(xLabels);

//         let yData: Array<number> = [];

//         this.props.fields.forEach(field => {
//           console.log(field);

//           yData.push(this.props.data[traceName][field]);
//         });

//         return {
//           x: xLabels,
//           y: yData,
//           name: traceName,
//           type: "bar"
//         };
//       });
//     } else {
//       this.traces = this.props.traces.map((traceName: keyof IMatch) => {
//         const xLabels = this.props.teams;
//         let yData: Array<number> = [];

//         this.props.teams.forEach(team => {
//           yData.push(this.props.data[team][traceName]);
//         });

//         return {
//           x: xLabels,
//           y: yData,
//           name: traceName,
//           type: "bar"
//         };
//       });
//     }
//     console.log("The traces are: ");
//     console.log(this.traces);
//   };
//   render() {
//     this.generateChart();

//     return (
//       <div>
//         <Plot
//           data={this.traces}
//           layout={{
//             width: 960,
//             height: 540,
//             // title: "A Fancy Plot",
//             barmode: "group",
//             plot_bgcolor: "#eef5f9",
//             paper_bgcolor: "#eef5f9",
//             xaxis: {
//               type: "category",
//               rangemode: "nonnegative"
//             },
//             yaxis: {
//               type: "linear",
//               rangemode: "nonnegative"
//             }
//           }}
//         />
//       </div>
//     );
//   }
// }
