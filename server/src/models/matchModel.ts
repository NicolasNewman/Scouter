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
    cargoPoints: {
        type: Number
    },
    hatchPoints: {
        type: Number
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
