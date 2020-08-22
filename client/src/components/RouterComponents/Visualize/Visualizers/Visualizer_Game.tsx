import * as React from 'react';
import { Component } from 'react';
import Timeline from '../PlotComponents/Timeline';
import { IGame, ITeam } from '../../../../global/modelTypes';
import Grid from '../../../Grid/Grid';

import { Select } from 'antd';
const { Option } = Select;

interface IProps {
    teamData: Array<ITeam>;
    gameData: Array<IGame>;
    noData: boolean;
}

interface IState {
    gameMatchNumber: number;
}

export default class Visualizer_Game extends Component<IProps, IState> {
    props: IProps;

    constructor(props: IProps) {
        super(props);
        this.state = {
            gameMatchNumber: this.props.gameData[0].matchNumber,
        };
    }

    gameMatchNumberChanged = (matchNumber: number) => {
        this.setState({
            gameMatchNumber: matchNumber,
        });
    };

    render() {
        const gameMatchNumberOptions = this.props.gameData.map((game) => {
            return (
                <Option key={game.matchNumber} value={game.matchNumber}>
                    {game.matchNumber}
                </Option>
            );
        });
        return (
            <React.Fragment>
                <div>
                    <span>Match number: </span>
                    <Select
                        onChange={this.gameMatchNumberChanged}
                        disabled={this.props.noData}
                        defaultActiveFirstOption={false}
                    >
                        {gameMatchNumberOptions}
                    </Select>
                </div>
                {this.props.gameData[this.state.gameMatchNumber - 1] ? (
                    <Grid
                        cols="50% 50%"
                        rows="10% 30% 30% 30%"
                        className="timeline-grid"
                        templateArea="
                            'red blue'
                            'rs1 bs1'
                            'rs2 bs2'
                            'rs3 bs3'"
                        gridElements={[
                            <h1 className="timeline-grid__heading r">Red</h1>,
                            <h1 className="timeline-grid__heading b">Blue</h1>,
                            <Timeline
                                gridAreaName="rs1"
                                match={
                                    this.props.gameData[
                                        this.state.gameMatchNumber - 1
                                    ].red.s1
                                }
                            />,
                            <Timeline
                                gridAreaName="rs2"
                                match={
                                    this.props.gameData[
                                        this.state.gameMatchNumber - 1
                                    ].red.s2
                                }
                            />,
                            <Timeline
                                gridAreaName="rs3"
                                match={
                                    this.props.gameData[
                                        this.state.gameMatchNumber - 1
                                    ].red.s3
                                }
                            />,
                            <Timeline
                                gridAreaName="bs1"
                                match={
                                    this.props.gameData[
                                        this.state.gameMatchNumber - 1
                                    ].blue.s1
                                }
                            />,
                            <Timeline
                                gridAreaName="bs2"
                                match={
                                    this.props.gameData[
                                        this.state.gameMatchNumber - 1
                                    ].blue.s2
                                }
                            />,
                            <Timeline
                                gridAreaName="bs3"
                                match={
                                    this.props.gameData[
                                        this.state.gameMatchNumber - 1
                                    ].blue.s3
                                }
                            />,
                        ]}
                    />
                ) : (
                    <p>A game could not be found</p>
                )}
            </React.Fragment>
        );
    }
}
