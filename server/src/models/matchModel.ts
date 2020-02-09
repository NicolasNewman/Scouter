import { Schema, model, Document } from 'mongoose';
import { RobotEventList, State, RobotEvent } from '../global/gameTypes';
// const ObjectId = Schema.Types.ObjectId;

export interface IMatch extends Document {
    matchNumber: number;
    teamNumber: number;
    robotEvents: Array<RobotEvent>;
    robotStates: Array<State>;
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

// matchSchema.pre<IMatch>(/^find/, function(next) {
//     this.populate({
//         path: 'team',
//         select: '-matches'
//     });
//     next();
// });

matchSchema.virtual('').get(() => {});

export default model<IMatch>('Match', matchSchema);
