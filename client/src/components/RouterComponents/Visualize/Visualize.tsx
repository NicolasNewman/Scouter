import * as React from 'react';
import { Component } from 'react';
import { History } from 'history';
import { IGame, ITeam } from '../../../global/modelTypes';

import Visualizer_Game from './Visualizers/Visualizer_Game';
import Visualizer_Team from './Visualizers/Visualizer_Game';

import { Tabs } from 'antd';
const { TabPane } = Tabs;

interface IProps {
    history: History;
    teamData: Array<ITeam>;
    gameData: Array<IGame>;
}

interface IState {
    noData: boolean;
    gameMatchNumber: number;
}

/**
 * Component for the plotly graphical display pane
 */
export default class Home extends Component<IProps, IState> {
    props: IProps;

    constructor(props: IProps) {
        super(props);
        console.log(this.props);
        if (this.props.gameData.length === 0) {
            this.state = {
                noData: true,
                gameMatchNumber: 0,
            };
        } else {
            this.state = {
                noData: false,
                gameMatchNumber: this.props.gameData[0].matchNumber,
            };
        }
    }

    componentDidUpdate() {
        // Update the data display flag if new data has been received
        if (this.state.noData && this.props.gameData.length > 0) {
            this.setState({ noData: false });
        }
    }

    gameMatchNumberChanged = (matchNumber: number) => {
        this.setState({
            gameMatchNumber: matchNumber,
        });
    };

    render() {
        return (
            <div className="graphs">
                {this.state.noData ? (
                    <p>
                        WARNING: You need to have match data entered before you
                        can use the visualizers
                    </p>
                ) : undefined}
                <Tabs>
                    <TabPane tab="Game" key="game" disabled={this.state.noData}>
                        <Visualizer_Game
                            gameData={this.props.gameData}
                            teamData={this.props.teamData}
                            noData={this.state.noData}
                        />
                    </TabPane>
                    <TabPane tab="Team" key="team" disabled={this.state.noData}>
                        <Visualizer_Team
                            gameData={this.props.gameData}
                            teamData={this.props.teamData}
                            noData={this.state.noData}
                        />
                    </TabPane>
                </Tabs>
            </div>
        );
        // } else {
        //   return <p>Something went wrong, please go back to home</p>;
        // }
    }
}
