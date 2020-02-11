import fetch from 'node-fetch';
import { IVritualizedMatches } from '../models/matchModel';
import {
    EScorableRobotEvents,
    IRobotEvent,
    Phase,
    // IRobotState,
    gameProperties
} from '../global/gameTypes';

const dataCompiler = async (): Promise<string> => {
    const res = await fetch('http://localhost:3000/data/matches');
    const json = await res.json();
    const matches: IVritualizedMatches = json.data.matches;
    let allData = '';
    matches.forEach(match => {
        let data = '';
        data = addDataToRow(data, match.matchNumber);
        data = addDataToRow(data, 'color');
        data = addDataToRow(data, match.teamNumber);
        // Initiation?
        data = addDataToRow(
            data,
            eventHappened(match.robotEvents, EScorableRobotEvents.INITIATION)
        );
        data = addDataToRow(data, 'played in auto');
        // Get auto scores
        let autoCycleEnd = 0;
        match.cycle.forEach(cycle => {
            // TODO IGNORE OVER 3
            if (cycle.interval.start) {
                if (getPhaseFromStartTime(cycle.interval.start) === 'AUTO') {
                    autoCycleEnd++;
                    const primaryEvent = getPrimaryCycleEvent(
                        cycle.cycleEvents
                    );
                    // Where?
                    data = addDataToRow(data, primaryEvent);
                    let attempt = 0;
                    let scored = 0;
                    cycle.cycleEvents.forEach(event => {
                        if (event.type === primaryEvent) {
                            if (event.success) {
                                attempt += 1;
                                scored += event.success;
                            }
                        }
                    });
                    data = addDataToRow(data, attempt);
                    data = addDataToRow(data, scored);
                }
            }
        });
        // Fill in the empty cycles
        if (autoCycleEnd < 3) {
            for (let i = autoCycleEnd; i < 3; i++) {
                data = addDataToRow(data, '');
                data = addDataToRow(data, '');
                data = addDataToRow(data, '');
            }
        }

        // Fill the remaining auto cycles
        if (autoCycleEnd < 3) {
            data = addEmptyColumns(data, 3 - autoCycleEnd);
        }

        match.cycle.forEach((cycle, i) => {
            if (i > autoCycleEnd) {
                const primaryEvent = getPrimaryCycleEvent(cycle.cycleEvents);
                data = addDataToRow(data, primaryEvent);
                let attempt = 0;
                let scored = 0;
                cycle.cycleEvents.forEach(event => {
                    if (event.type === primaryEvent) {
                        if (event.success) {
                            attempt += 1;
                            scored += event.success;
                        }
                    }
                });
                data = addDataToRow(data, attempt);
                data = addDataToRow(data, scored);
                data = addDataToRow(data, 'defended???');
                data = addDataToRow(data, 'and then?');
            }
        });
        allData = allData + data + '\n';
    });
    return allData;
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
};

const addEmptyColumns = (row: string, columns: number): string => {
    for (let i = 0; i < columns; i++) {
        row = addDataToRow(row, '');
    }
    return row;
};

const addDataToRow = (row: string, col: string | number): string => {
    if (row !== '') {
        return `${row},${col}`;
    }
    return col.toString();
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
