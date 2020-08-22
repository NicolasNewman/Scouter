import * as React from 'react';
import { Component } from 'react';
import { IGame, ITeam } from '../../../../global/modelTypes';

import { ColumnProps } from 'antd/es/table';
import { EventList, StateList } from '../../../../global/gameTypes';
import scoreResolver from '../../../../global/scoreResolver';
import { Select, Table } from 'antd';
const { Option } = Select;

interface IProps {
    teamData: Array<ITeam>;
    gameData: Array<IGame>;
    noData: boolean;
}

interface IState {
    compiledData: MatchTableData[] | undefined;
}

type MatchTableData = {
    key: string;
    [val: string]: any;
};

export default class Visualizer_Game extends Component<IProps, IState> {
    props: IProps;
    matchCols: ColumnProps<any>[];
    data: { [team: string]: MatchTableData[] };

    constructor(props: IProps) {
        super(props);
        this.state = {
            compiledData: undefined,
        };
        this.data = {};
        this.matchCols = [
            {
                title: 'Match',
                dataIndex: 'match',
                key: 'match',
            },
            {
                title: 'Alliance',
                dataIndex: 'alliance',
                key: 'alliance',
                render: (data: number[]) => data.join(', '),
            },
            {
                title: 'Opponents',
                dataIndex: 'opponents',
                key: 'opponents',
                render: (data: number[]) => data.join(', '),
            },
            {
                title: 'Points Scored',
                dataIndex: 'points',
                key: 'points',
            },
        ];
        EventList.forEach((event) => {
            this.matchCols.push({
                title: event,
                dataIndex: event.toLowerCase(),
                key: event.toLowerCase(),
            });
        });
    }

    getMatchData = (teamNumber: number) => {
        console.log('Checking for team ' + teamNumber);
        console.log(this.data[teamNumber]);
        if (this.data[teamNumber] === undefined) {
            console.log('Looping through: ');
            console.log(this.props.teamData);
            const team = this.props.teamData.find((t) => {
                console.log(typeof t.teamNumber);
                console.log(typeof teamNumber);
                console.log(
                    `${t.teamNumber}===${teamNumber}: ${
                        `${t.teamNumber}` === `${teamNumber}`
                    }`
                );
                return `${t.teamNumber}` === `${teamNumber}`;
            });
            console.log('Found team:');
            console.log(team);
            if (team) {
                this.data[teamNumber] = [];
                team.matches.forEach((match, i) => {
                    const game = this.props.gameData.find(
                        (game) => game.matchNumber === match.matchNumber
                    );
                    if (game) {
                        const alliance = game[match.alliance];
                        const opponent =
                            game[match.alliance === 'red' ? 'blue' : 'red'];
                        const row: MatchTableData = {
                            key: i.toString(),
                            match: match.matchNumber,
                            alliance: [
                                alliance.s1.teamNumber,
                                alliance.s2.teamNumber,
                                alliance.s3.teamNumber,
                            ],
                            opponents: [
                                opponent.s1.teamNumber,
                                opponent.s2.teamNumber,
                                opponent.s3.teamNumber,
                            ],
                        };

                        let points = 0;
                        match.robotEvents.forEach((event) => {
                            points += event.points ? event.points : 0;
                            const lowerName = event.type
                                .toString()
                                .toLowerCase();
                            if (!row[lowerName]) {
                                row[lowerName] = 1;
                            } else {
                                row[lowerName] += 1;
                            }
                        });
                        row.points = points;

                        this.data[teamNumber].push(row);
                    }
                });
            }
        }
        console.log(this.data);
        return this.data[teamNumber];
    };

    teamNumberChanged = (teamNumber: number) => {
        this.setState({
            compiledData: this.getMatchData(teamNumber),
        });
    };

    render() {
        const gameMatchNumberOptions = this.props.teamData.map((team) => {
            return (
                <Option
                    key={team.teamNumber}
                >{`${team.teamNumber} / ${team.teamName}`}</Option>
            );
        });
        return (
            <React.Fragment>
                <div>
                    <span>Team number: </span>
                    <Select
                        onChange={this.teamNumberChanged}
                        disabled={this.props.noData}
                        defaultActiveFirstOption={false}
                    >
                        {gameMatchNumberOptions}
                    </Select>
                </div>
                {!this.props.noData ? (
                    <Table
                        columns={this.matchCols}
                        dataSource={this.state.compiledData}
                    />
                ) : (
                    <p>A game could not be found</p>
                )}
            </React.Fragment>
        );
    }
}
