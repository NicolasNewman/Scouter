import { Schema, model, Document } from 'mongoose';
import { RobotEventList, IRobotState, IRobotEvent } from '../global/gameTypes';
import accuracyResolver from '../global/accuracyResolver';
import { cycleDeterminer, Duration, gameProperties } from '../global/gameTypes';
import { ICycle } from '../global/modelTypes';
// const ObjectId = Schema.Types.ObjectId;

export interface IMatch extends Document {
    matchNumber: number;
    teamNumber: number;
    alliance: string;
    robotEvents: Array<IRobotEvent>;
    robotStates: Array<IRobotState>;
}

// export type VritualizedMatches = Array<IVirtualizedMatch>;

// interface IVirtualizedMatch {
//     matchNumber: number;
//     teamNumber: number;
//     robotEvents: Array<IRobotEvent>;
//     robotState: Array<IRobotState>;
//     points: number;
//     accuracy: {
//         [key: string]: number;
//     };
//     cycle: Array<ICycle>;
// }

// interface ICycle {
//     interval: Duration;
//     cycleEvents: Array<IRobotEvent>;
//     cycleStates: Array<IRobotState>;
// }

const matchSchema = new Schema({
    matchNumber: {
        type: Number,
        required: [true, 'A match must have a number!']
    },
    teamNumber: {
        type: Number,
        required: [true, 'A match must have a team number!']
    },
    alliance: {
        type: String,
        enum: ['red', 'blue'],
        required: [true, 'A match must have an alliance color']
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
    // 1) Filter the states that are part of the cycleStart or end into cycleStates
    let cycleStates: Array<IRobotState> = [];

    // Add the states that determine a cycles start or end to a list
    this.robotStates.forEach(state => {
        if (state.type === cycleDeterminer) {
            cycleStates.push(state);
        }
    });

    // 2) Sort the events in that list by time
    cycleStates = cycleStates.sort((a, b) => {
        if (a.start && b.start) {
            return a.start < b.start ? 1 : -1;
        }
        return 0;
    });

    // 3) Figure out the time intervals that each cycle happens over
    const cycleIntervals: Array<Duration> = [{}];
    let cycleIntervalIndx = 0;
    cycleStates.forEach((state, i) => {
        // The first event starts when the when the game starts
        if (i === 0) {
            cycleIntervals[0] = {
                start: gameProperties.matchDuration,
                end: state.end
            };
            cycleIntervalIndx++;
            cycleIntervals.push({ start: state.end });
        } else {
            cycleIntervals[cycleIntervalIndx].end = state.end;
            cycleIntervalIndx++;
            cycleIntervals.push({ start: state.end });
        }
    });

    // Bridge the last event so it has an end
    cycleIntervals[cycleIntervalIndx].end = 0;

    // Remove a trailing cycle if its empty
    if (
        cycleIntervals.length > 0 &&
        !cycleIntervals[cycleIntervals.length - 1].start &&
        !cycleIntervals[cycleIntervals.length - 1].end
    ) {
        cycleIntervals.pop();
    }

    // 4) Build the array of cycles
    const cycles: Array<ICycle> = [];
    // Loop through each previously computed interval
    cycleIntervals.forEach(interval => {
        const cycleEvents: Array<IRobotEvent> = [];
        const cycleStates: Array<IRobotState> = [];
        // Find the events that took place on that interval
        this.robotEvents.forEach(event => {
            if (interval.start && interval.end) {
                // Check if the event happened over the interval for that cycle
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
                // Check if the event happened over the interval for that cycle
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
