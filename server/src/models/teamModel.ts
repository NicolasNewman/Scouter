import { Schema, model, Document } from 'mongoose';
const ObjectId = Schema.Types.ObjectId;

interface ITeam extends Document {
    teamName: string;
    teamNumber: number;
    matches: Array<string>;
}

const teamSchema: Schema = new Schema({
    teamName: {
        type: String,
        required: [true, 'A team must have a name']
    },
    teamNumber: {
        type: Number,
        min: [1, 'The team number must be greater then zero'],
        required: [true, 'A team must have a number'],
        unique: true
    },
    matches: [
        {
            type: ObjectId,
            ref: 'Match'
        }
    ]
});

teamSchema.pre<ITeam>(/^find/, function(next) {
    this.populate({
        path: 'matches',
        select: '-team'
    });
    next();
});

export default model<ITeam>('Team', teamSchema);
