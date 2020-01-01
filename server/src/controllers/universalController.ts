import { Request, Response, NextFunction } from 'express';
// import * as flatten from 'flat';
import { catchAsync } from '../utils/catchAsync';
import { CustomError } from '../utils/error';
// import { Types } from 'mongoose';

// const ObjectId = Types.ObjectId;

import Game from '../models/gameModel';
import Match from '../models/matchModel';
import Team from '../models/teamModel';
import { logger } from '../utils/logger';

// /:matchNumber/:alliance/:seed/:teamNumber/match
// Match is in body
export const postMatch = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const matchNumber = req.params.matchNumber;
        const alliance = req.params.alliance;
        const seed = req.params.seed;
        const teamNumber = req.params.teamNumber;
        logger.info(
            `Adding data to match ${matchNumber} for the team ${teamNumber} on the ${alliance} alliance in seed ${seed}`
        );

        let match = req.body;
        const team = await Team.findOne({ teamNumber });
        if (team) {
            // Add the team to the match
            match.team = team._id;
            match.matchNumber = matchNumber;
            match = await Match.create(match);

            // Add the match to the team
            team.matches.push(match._id);
            await team.save();
            // await Team.update(team, { $push: { matches: match._id } });

            // Add the match to the game
            console.log(seed);
            console.log({ [alliance]: { [seed]: match._id } });

            const loc = `${alliance}.${seed}`;
            const game = await Game.findOneAndUpdate(
                { matchNumber },
                // flatten({ [alliance]: { [seed]: ObjectId(match._id) } }),
                // { $set: { [alliance]: { [seed]: match._id } } },
                { $set: { [loc]: match._id } },
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
