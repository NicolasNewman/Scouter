import { Schema, model, Document } from 'mongoose';
import { RobotEventList, IRobotState, IRobotEvent } from '../global/gameTypes';
import accuracyResolver from '../global/accuracyResolver';
import { cycleDeterminer, Duration, gameProperties } from '../global/gameTypes';
// const ObjectId = Schema.Types.ObjectId;

export interface IMatch extends Document {
    matchNumber: number;
    teamNumber: number;
    robotEvents: Array<IRobotEvent>;
    robotStates: Array<IRobotState>;
}

export type IVritualizedMatches = Array<IVirtualizedMatch>;

interface IVirtualizedMatch {
    matchNumber: number;
    teamNumber: number;
    robotEvents: Array<IRobotEvent>;
    robotState: Array<IRobotState>;
    points: number;
    accuracy: {
        [key: string]: number;
    };
    cycle: Array<ICycle>;
}

interface ICycle {
    interval: Duration;
    cycleEvents: Array<IRobotEvent>;
    cycleStates: Array<IRobotState>;
}

// type Cycle = {
//     start: number;
//     end: number;
//     gathering: number;
//     shooting: number;
// };

const matchSchema = new Schema({
    matchNumber: {
        type: Number,
        required: [true, 'A match must have a number!']
    },
    teamNumber: {
        type: Number,
        required: [true, 'A match must have a team number!']
    },
    robotEvents: [
        {
            type: {
                type: String,
                enum: RobotEventList,
                required: [true, 'A event type is required!']
            },
            points: Number,
            success: {
                type: Number,
                enum: [1, 0]
            },
            start: Number
        }
    ],
    robotStates: [
        {
            type: {
                type: String,
                // enum: [...RobotStateTypes],
                required: [true, 'A state type is required!']
            },
            start: Number,
            end: Number
        }
    ]
});

// schema.set('toJSON', { getters: true, virtuals: false });
matchSchema.set('toJSON', { virtuals: true });

// matchSchema.pre<IMatch>(/^find/, function(next) {
//     this.populate({
//         path: 'team',
//         select: '-matches'
//     });
//     next();
// });

matchSchema.virtual('points').get(function(this: IMatch) {
    let sum = 0;
    this.robotEvents.forEach(event => {
        if (event.points) {
            sum += event.points;
        }
    });
    return sum;
});

matchSchema.virtual('accuracy').get(function(this: IMatch) {
    // const typeToOccurence = {};
    // const typeToSuccess = {}
    const statMap: { [key: string]: { hit: number; total: number } } = {};
    this.robotEvents.forEach(event => {
        if (accuracyResolver(event.type)) {
            if (!statMap[event.type.toString()]) {
                statMap[event.type.toString()] = { hit: 0, total: 0 };
            }
            statMap[event.type.toString()].total += 1;
            if (event.success) {
                statMap[event.type.toString()].hit += event.success;
            }
        }
    });
    const accuracyMap: { [key: string]: number } = {};
    for (let key in statMap) {
        accuracyMap[key] = statMap[key].hit / statMap[key].total;
    }
    return accuracyMap;
});

/**
 * Match starts with cells loaded
 * 1) The robot makes their shots in auto
 * 2) They go back to gather
 * 3) They shoot
 */
matchSchema.virtual('cycle').get(function(this: IMatch) {
    let cycleStates: Array<IRobotState> = [];

    // Add the states that determine a cycles start or end to a list
    this.robotStates.forEach(state => {
        if (
            state.type === cycleDeterminer.cycleStart ||
            state.type === cycleDeterminer.cycleEnd
        ) {
            cycleStates.push(state);
        }
    });

    // Sort the events in that list by time
    cycleStates = cycleStates.sort((a, b) => {
        if (a.start && b.start) {
            return a.start < b.start ? 1 : -1;
        }
        return 0;
    });
    console.log('SORTED BY TIME');
    console.log(cycleStates);

    // Get the time intervals of each cycle
    const cycleIntervals: Array<Duration> = [];
    let cycleIntervalIndx = 0;
    let onStart = true;
    cycleStates.forEach((state, i) => {
        // The very first event could be either cycleStart or cycleEnd, depending on if the robot starts pre-loaded and chooses to shoot
        if (state.type === cycleDeterminer.cycleEnd && i === 0) {
            cycleIntervals[0] = {
                start: gameProperties.matchDuration,
                end: state.end
            };
            cycleIntervalIndx++;
            cycleIntervals.push({});
        }

        // If we are looking for the  begining of a cycle
        if (
            onStart &&
            !cycleIntervals[cycleIntervalIndx].start &&
            state.type === cycleDeterminer.cycleStart
        ) {
            cycleIntervals[cycleIntervalIndx].start = state.start;
            onStart = false;
        }

        // If we are looking for the end of a cycle
        if (
            !onStart &&
            !cycleIntervals[cycleIntervalIndx].end &&
            state.type === cycleDeterminer.cycleEnd
        ) {
            cycleIntervals[cycleIntervalIndx].end = state.end;
            onStart = true;
            cycleIntervalIndx++;
            cycleIntervals.push({});
        }
    });

    // Remove a trailing cycle if its empty
    if (
        cycleIntervals.length > 0 &&
        !cycleIntervals[cycleIntervals.length - 1].start &&
        !cycleIntervals[cycleIntervals.length - 1].end
    ) {
        cycleIntervals.pop();
    }

    console.log('INTERVALS');
    console.log(cycleIntervals);

    // Build the array of cycles
    const cycles: Array<ICycle> = [];
    // Loop through each previously computed interval
    cycleIntervals.forEach(interval => {
        const cycleEvents: Array<IRobotEvent> = [];
        const cycleStates: Array<IRobotState> = [];
        // Find the events that took place on that interval
        this.robotEvents.forEach(event => {
            console.log(`Checking event ${event.type}`);
            if (interval.start && interval.end) {
                console.log(
                    `The event happened at ${event.start} and the interval is on [${interval.start},${interval.end}]`
                );
                if (
                    interval.start >= event.start &&
                    event.start >= interval.end
                ) {
                    cycleEvents.push(event);
                }
            }
        });
        // Find the states that took place on that interval
        this.robotStates.forEach(state => {
            if (interval.start && state.start && state.end && interval.end) {
                if (
                    interval.start >= state.start &&
                    state.end >= interval.end
                ) {
                    cycleStates.push(state);
                }
            }
        });

        cycles.push({
            interval,
            cycleEvents,
            cycleStates
        });
    });

    console.log('CYCLES');
    console.log(cycles);

    return cycles;

    // const cycleRanges: Array<{ start: number; end: number | undefined }> = [
    //     { start: 0, end: 0 }
    // ];
    // let cycleIndex = 0;
    // let search: 'start' | 'end' = 'start';
    // this.robotStates.forEach(state => {
    //     if (state.type === 'SHOOTING' && cycleIndex == 0) {
    //         cycleRanges[cycleIndex].end = state.end;
    //         cycleIndex++;
    //         cycleRanges[cycleIndex] = { start: -1, end: -1 };
    //     }
    //     if (search === 'start' && cycleIndex > 0) {
    //         if (state.type === 'GATHERING') {
    //         }
    //     }
    // });
});

export default model<IMatch>('Match', matchSchema);
