import * as React from 'react';
import { Component } from 'react';

import { Button } from 'antd';

import {
    ERobotEvents,
    EScorableRobotEvents,
    Phase,
    IRobotEvent,
} from '../../../../global/gameTypes';
import { IGridElementProps } from '../../../Grid/Grid';
import resolveScore from '../../../../../../global/scoreResolver';
import { IConstantProps } from '../DataInput';

interface IProps extends IGridElementProps {
    constants: IConstantProps;
    label: string;
    type: ERobotEvents | EScorableRobotEvents;
    phase: Phase;
    color?: string;
    disabled?: boolean;
}

export default class AccuracyEventButton extends Component<IProps> {
    constructor(props: IProps) {
        super(props);
    }

    clicked = (_e: React.SyntheticEvent, success: 1 | 0) => {
        const points = resolveScore(this.props.type, this.props.phase);
        const event: IRobotEvent = {
            type: this.props.type,
            start: this.props.constants.getTime(),
            success,
        };
        if (points > 0 && success > 0) {
            event.points = points;
        }
        console.log(event);

        this.props.constants.handler.post(
            `matches/${this.props.constants.matchNumber}/${this.props.constants.teamNumber}/event`,
            event
        );
    };

    render() {
        return (
            <div
                style={{
                    gridArea: this.props.gridAreaName,
                }}
                className="accuracy-btn"
            >
                <p className="accuracy-btn__label">{this.props.label}</p>
                <div className="accuracy-btn__container">
                    <Button
                        className="accuracy-btn__success accuracy-btn--left"
                        onClick={(e) => this.clicked(e, 1)}
                        disabled={this.props.disabled}
                    >
                        Hit
                    </Button>
                    <Button
                        className="accuracy-btn__failure accuracy-btn--right"
                        onClick={(e) => this.clicked(e, 0)}
                        disabled={this.props.disabled}
                    >
                        Miss
                    </Button>
                </div>
            </div>
        );
    }
}
