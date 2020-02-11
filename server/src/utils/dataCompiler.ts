import fetch from 'node-fetch';
import { IVritualizedMatches } from '../models/matchModel';
import {
    EScorableRobotEvents,
    IRobotEvent,
    Phase,
    IRobotState,
    gameProperties
} from '../global/gameTypes';

const dataCompiler = async (): Promise<string> => {
    const res = await fetch('http://localhost:3000/data/matches');
    const json = await res.json();
    const matches: IVritualizedMatches = json.data.matches;
    let data = '';
    matches.forEach(match => {
        data = addDataToRow(data, match.matchNumber);
        data = addDataToRow(data, match.teamNumber);
        // Initiation?
        data = addDataToRow(
            data,
            eventHappened(match.robotEvents, EScorableRobotEvents.INITIATION)
        );

        // Get auto scores
        let locations: Array<string> = [];
        let attempt = 0;
        let scored = 0;
        let autoCycleEnd = 0;
        match.cycle.forEach(cycle => {
            if (cycle.interval.start) {
                if (getPhaseFromStartTime(cycle.interval.start) === "AUTO") {
                    autoCycleEnd++;
                    const primaryEvent = getPrimaryCycleEvent(cycle.cycleEvents);
                    if (!locations.includes(primaryEvent)) {
                        locations.push(primaryEvent);
                    }
                    cycle.cycleEvents.forEach(event => {
                        if (event.type === primaryEvent) {
                            if (event.success) {
                                attempt += 1;
                                scored += event.success;
                            }
                        }
                    });
                }
            }
        });
        data = addDataToRow(data, locations.join(', '));
        data = addDataToRow(data, attempt);
        data = addDataToRow(data, scored);

        let cyclesWritten = 0;
        let cycleMax = ;
        match.cycle.forEach((cycle, i) => {
            if (i >= autoCycleEnd) {

            }
        });
    });
    return '';
};

const getPhaseFromStartTime = (start: number): Phase => {
        if (gameProperties.endgame.start && gameProperties.teleop.start) {
            if (start < gameProperties.endgame.start) {
                return 'ENDGAME';
            } else if (start < gameProperties.teleop.start) {
                return 'TELEOP';
            } else {
                return 'AUTO';
            }
        }
        return 'AUTO';
    }
};

const addDataToRow = (row: string, col: string | number): string => {
    return `${row},${col}`;
};

const getPrimaryCycleEvent = (events: Array<IRobotEvent>): string => {
    const eventToOccurence: { [key: string]: number } = {};
    events.forEach(event => {
        if (!eventToOccurence[event.type]) {
            eventToOccurence[event.type] = 1;
        } else {
            eventToOccurence[event.type] += 1;
        }
    });

    return Object.keys(eventToOccurence).reduce((a, b) =>
        eventToOccurence[a] > eventToOccurence[b] ? a : b
    );
};

const eventHappened = (events: Array<IRobotEvent>, type: string): string => {
    let found = 'No';
    events.forEach(event => {
        if (event.type === type) {
            found = 'Yes';
        }
    });
    return found;
};

export default dataCompiler;
