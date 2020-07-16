import { Schema, model, Document } from 'mongoose';
const ObjectId = Schema.Types.ObjectId;

import { TeamEvent, TeamEventList } from '../global/gameTypes';

interface AllianceData {
    s1: any;
    s2: any;
    s3: any;
    teamEvents: Array<TeamEvent>;
}

interface IGame extends Document {
    matchNumber: number;
    red: AllianceData;
    blue: AllianceData;
}

const gameSchema = new Schema({
    matchNumber: {
        type: Number,
        required: [true, 'A match must have a number!'],
        unique: true
    },
    red: {
        s1: {
            type: ObjectId,
            ref: 'Match'
        },
        s2: {
            type: ObjectId,
            ref: 'Match'
        },
        s3: {
            type: ObjectId,
            ref: 'Match'
        },
        teamEvents: [
            {
                type: {
                    type: String,
                    enum: TeamEventList,
                    required: [true, 'A events type is required!']
                },
                start: { type: Date, default: Date.now },
                points: Number
            }
        ]
    },
    blue: {
        s1: {
            type: ObjectId,
            ref: 'Match'
        },
        s2: {
            type: ObjectId,
            ref: 'Match'
        },
        s3: {
            type: ObjectId,
            ref: 'Match'
        },
        teamEvents: [
            {
                type: {
                    type: String,
                    enum: TeamEventList,
                    required: [true, 'A events type is required!']
                },
                start: { type: Date, default: Date.now },
                points: Number
            }
        ]
    }
});

gameSchema.pre<IGame>(/^find/, function(next) {
    this.populate({
        path: 'red.s1 red.s2 red.s3 blue.s1 blue.s2 blue.s3',
        select: '-matchNumber'
    });
    next();
});

export default model<IGame>('Game', gameSchema);
