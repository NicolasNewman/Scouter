import { Schema, model, Document } from 'mongoose';
import {
    RobotEvent,
    RobotEventTypes,
    RobotState,
    RobotStateTypes
} from '../types/gameTypes';
// const ObjectId = Schema.Types.ObjectId;

export interface IMatch extends Document {
    matchNumber: number;
    team: any;
    robotEvents: Array<RobotEvent>;
    robotState: Array<RobotState>;
}

const matchSchema = new Schema({
    matchNumber: {
        type: Number,
        required: [true, 'A match must have a number!']
    },
    teamNumber: {
        type: Number,
        required: [true, 'A match must have a team number!']
    },
    robotEvent: [
        {
            type: {
                type: String,
                enum: [...RobotEventTypes],
                required: [true, 'A event type is required!']
            },
            points: Number,
            start: { type: Date, default: Date.now }
        }
    ],
    robotState: [
        {
            type: {
                type: String,
                enum: [...RobotStateTypes],
                required: [true, 'A state type is required!']
            },
            start: { type: Date, default: Date.now },
            end: { type: Date }
        }
    ]
});

// matchSchema.pre<IMatch>(/^find/, function(next) {
//     this.populate({
//         path: 'team',
//         select: '-matches'
//     });
//     next();
// });

export default model<IMatch>('Match', matchSchema);
