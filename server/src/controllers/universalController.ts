import { Request, Response, NextFunction } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { CustomError } from '../utils/error';

import Game from '../models/gameModel';
import Match from '../models/matchModel';
import Team from '../models/teamModel';

// /:matchNumber/:alliance/:seed/:teamNumber/match
// Match is in body
export const postMatch = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const matchNumber = req.params.matchNumber;
        const alliance = req.params.alliance;
        const seed = req.params.seed;
        const teamNumber = req.params.teamNumber;

        let match = req.body;
        const team = await Team.findOne({ teamNumber });
        if (team) {
            // Add the team to the match
            match.team = team._id;
            match.matchNumber = matchNumber;
            match = await Match.create(match);

            // Add the match to the team
            await Team.update(team, { $push: { matches: match._id } });

            // Add the match to the game
            console.log(seed);
            console.log({ [alliance]: { [seed]: match._id } });

            const game = await Game.findOneAndUpdate(
                { matchNumber },
                { [alliance]: { [seed]: match._id } },
                { new: true }
            );
            res.status(200).json({
                status: 'success',
                data: {
                    game
                }
            });
        } else {
            next(new CustomError(404, `Error accessing team ${teamNumber}`));
        }
    }
);
