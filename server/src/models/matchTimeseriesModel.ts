import { Schema, model, Document } from 'mongoose';
const ObjectId = Schema.Types.ObjectId;

export interface IMatch extends Document {}

const matchSchema = new Schema({
    matchNumber: {
        type: Number,
        required: [true, 'A match must have a number!']
    },
    team: {
        type: ObjectId,
        ref: 'Team'
    },
    csHatch: {
        type: Number
    },
    csCargo: {
        type: Number
    },
    r1Hatch: {
        type: Number
    },
    r2Hatch: {
        type: Number
    },
    r3Hatch: {
        type: Number
    },
    r1Cargo: {
        type: Number
    },
    r2Cargo: {
        type: Number
    },
    r3Cargo: {
        type: Number
    },
    habOne: {
        type: Boolean
    },
    habTwo: {
        type: Boolean
    },
    habThree: {
        type: Boolean
    }
});

matchSchema.pre<IMatch>(/^find/, function(next) {
    this.populate({
        path: 'team',
        select: '-matches'
    });
    next();
});

export default model<IMatch>('Match', matchSchema);
