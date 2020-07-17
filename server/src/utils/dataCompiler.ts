// import fetch from 'node-fetch';
// import { VritualizedMatches } from '../global/modelTypes';
// import {
//     EScorableRobotEvents,
//     IRobotEvent,
//     Phase,
//     // IRobotState,
//     gameProperties,
//     ERobotStates,
//     // ERobotEvents,
//     EFoulEvents
// } from '../global/gameTypes';

/**
 * Writes data in the format
 *
 * match #, alliance color, team #
 * initiation, try to score?
 * where?, how many tried?, how many success?, blank (x3 for auto)
 * where?, how many tried?, how many success?, defneded against, blank (x24)
 * where?, how many tried?, how many success?, defneded against (x1)
 * # of fouls, # of tech fouls, rotation, position, end game park or climb, climb duration
 */
const dataCompiler = async (): Promise<string> => {
    // const res = await fetch('http://localhost:3000/data/matches');
    // const json = await res.json();
    // const matches: VritualizedMatches = json.data.matches;
    let allData = '';
    // matches.forEach(match => {
    //     let data = '';
    //     // match number
    //     if (match.matchNumber) {
    //         data = addDataToRow(data, match.matchNumber);
    //     } else {
    //         data = addDataToRow(data, -1);
    //     }

    //     // TODO alliance color
    //     data = addDataToRow(data, match.alliance);
    //     // team number
    //     data = addDataToRow(data, match.teamNumber);
    //     // Initiation?
    //     data = addDataToRow(
    //         data,
    //         eventHappened(match.robotEvents, EScorableRobotEvents.INITIATION)
    //     );
    //     // TODO try to score: regex to replace phrase once you know in loop?
    //     data = addDataToRow(data, '$PLAYED_IN_AUTO');

    //     // Get auto scores
    //     let autoCycles = 0;
    //     // Based on the API's algorithm, we can assume that the cycles are in order from earliest to latest
    //     for (let i = 0; i < match.cycle.length; i++) {
    //         const cycle = match.cycle[i];
    //         if (autoCycles >= 3) {
    //             break;
    //         }
    //         // If the cycle has a start time
    //         if (cycle.interval.start) {
    //             // If the start time takes place during auto
    //             if (getPhaseFromStartTime(cycle.interval.start) === 'AUTO') {
    //                 // Get the most frequent event from that cycle. This will generally be from powercells
    //                 const primaryEvent = getPrimaryCycleEvent(
    //                     cycle.cycleEvents
    //                 );
    //                 // Where?
    //                 data = addDataToRow(data, primaryEvent);
    //                 let attempt = 0;
    //                 let scored = 0;
    //                 cycle.cycleEvents.forEach(event => {
    //                     if (event.type === primaryEvent) {
    //                         if (event.success) {
    //                             attempt += 1;
    //                             scored += event.success;
    //                         }
    //                     }
    //                 });
    //                 data = addDataToRow(data, attempt);
    //                 data = addDataToRow(data, scored);
    //                 if (autoCycles < 2) {
    //                     data = addDataToRow(data, 'and then?'); // and then is blank
    //                 }
    //                 autoCycles++;
    //             }
    //         }
    //     }
    //     // Fill in the empty cycles
    //     if (autoCycles < 3) {
    //         for (let i = autoCycles; i < 3; i++) {
    //             data = addEmptyColumns(data, 3);
    //             if (i < 2) {
    //                 data = addDataToRow(data, 'and then?');
    //             }
    //         }
    //     }

    //     // Now that we know if the robot played in auto, update the previous field
    //     if (autoCycles > 0) {
    //         data = data.replace('$PLAYED_IN_AUTO', 'Yes');
    //     } else {
    //         data = data.replace('$PLAYED_IN_AUTO', 'Yes');
    //     }

    //     // Now compute the cycles for teleop
    //     let matchCycles = 0;
    //     let foul = 0;
    //     let techFoul = 0;
    //     let rotation = 'No';
    //     let position = 'No';
    //     let parkOrClimb = 'No';
    //     let climbDuration = 0;
    //     for (let i = autoCycles; i < match.cycle.length; i++) {
    //         matchCycles++;
    //         if (matchCycles >= 24) {
    //             break;
    //         }
    //         const cycle = match.cycle[i];
    //         const primaryEvent = getPrimaryCycleEvent(cycle.cycleEvents);
    //         data = addDataToRow(data, primaryEvent);
    //         let attempt = 0;
    //         let scored = 0;
    //         cycle.cycleEvents.forEach(event => {
    //             if (event.type === primaryEvent) {
    //                 if (event.success) {
    //                     attempt += 1;
    //                     scored += event.success;
    //                 }
    //             }
    //             if (event.type === EFoulEvents.FOUL) {
    //                 foul++;
    //             } else if (event.type === EFoulEvents.TECH_FOUL) {
    //                 techFoul++;
    //             } else if (
    //                 event.type === EScorableRobotEvents.POSITION_CONTROL
    //             ) {
    //                 position = 'Yes';
    //             } else if (
    //                 event.type === EScorableRobotEvents.ROTATION_CONTROL
    //             ) {
    //                 rotation = 'Yes';
    //             } else if (
    //                 event.type === EScorableRobotEvents.PARK ||
    //                 event.type === EScorableRobotEvents.HANG
    //             ) {
    //                 parkOrClimb = 'Yes';
    //             }
    //         });

    //         let defendedAgainst = 'No';
    //         cycle.cycleStates.forEach(state => {
    //             if (state.type === ERobotStates.DEFENDED) {
    //                 defendedAgainst = 'Yes';
    //             } else if (state.type === ERobotStates.CLIMBING) {
    //                 parkOrClimb = 'Yes';
    //                 if (state.start && state.end) {
    //                     climbDuration += state.start - state.end;
    //                 }
    //             }
    //         });
    //         data = addDataToRow(data, attempt);
    //         data = addDataToRow(data, scored);
    //         data = addDataToRow(data, defendedAgainst);
    //         data = addDataToRow(data, 'and then?'); // and then is blank
    //     }
    //     if (matchCycles < 24) {
    //         for (let i = matchCycles; i < 24; i++) {
    //             data = addEmptyColumns(data, 4);
    //             // data = addDataToRow(data, 'primaryEvent');
    //             // data = addDataToRow(data, 'attempt');
    //             // data = addDataToRow(data, 'scored');
    //             // data = addDataToRow(data, 'defnededAgainst');
    //             data = addDataToRow(data, 'and then?'); // and then is blank
    //         }
    //     }
    //     data = addEmptyColumns(data, 4);
    //     data = addDataToRow(data, foul);
    //     data = addDataToRow(data, techFoul);
    //     data = addDataToRow(data, rotation);
    //     data = addDataToRow(data, position);
    //     data = addDataToRow(data, parkOrClimb);
    //     data = addDataToRow(data, climbDuration);
    //     allData = allData + data + '\n';
    // });
    return allData;
};

// /**
//  * Returns the phase based on a starting time
//  * @param start
//  */
// const getPhaseFromStartTime = (start: number): Phase => {
//     if (gameProperties.endgame.start && gameProperties.teleop.start) {
//         if (start < gameProperties.endgame.start) {
//             return 'ENDGAME';
//         } else if (start < gameProperties.teleop.start) {
//             return 'TELEOP';
//         } else {
//             return 'AUTO';
//         }
//     }
//     return 'AUTO';
// };

// const addEmptyColumns = (row: string, columns: number): string => {
//     for (let i = 0; i < columns; i++) {
//         row = addDataToRow(row, '');
//     }
//     return row;
// };

// const addDataToRow = (row: string, col: string | number): string => {
//     if (row !== '') {
//         return `${row},${col}`;
//     }
//     return col.toString();
// };

// /**
//  * Gets the most common event in a list
//  * @param events - a list of the events to go through
//  */
// const getPrimaryCycleEvent = (events: Array<IRobotEvent>): string => {
//     const eventToOccurence: { [key: string]: number } = {};
//     events.forEach(event => {
//         if (!eventToOccurence[event.type]) {
//             eventToOccurence[event.type] = 1;
//         } else {
//             eventToOccurence[event.type] += 1;
//         }
//     });

//     return Object.keys(eventToOccurence).reduce((a, b) =>
//         eventToOccurence[a] > eventToOccurence[b] ? a : b
//     );
// };

// /**
//  * Returns yes if the type was found in events
//  * @param events - the list of events to search through
//  * @param type - the type of event to look for
//  */
// const eventHappened = (events: Array<IRobotEvent>, type: string): string => {
//     let found = 'No';
//     events.forEach(event => {
//         if (event.type === type) {
//             found = 'Yes';
//         }
//     });
//     return found;
// };

export default dataCompiler;
