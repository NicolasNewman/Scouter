import { Schema, model, Document } from 'mongoose';
const ObjectId = Schema.Types.ObjectId;

interface IGame extends Document {}

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
        }
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
        }
    }
});

gameSchema.pre<IGame>(/^find/, function(next) {
    this.populate({
        path: 'red.s1',
        select: '-matchNumber'
    });
    next();
});

export default model<IGame>('Game', gameSchema);
