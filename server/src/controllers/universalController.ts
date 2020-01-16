import { Request, Response, NextFunction } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { CustomError } from '../utils/error';

import Game from '../models/gameModel';
import Match from '../models/matchModel';
import Team from '../models/teamModel';
import { logger } from '../utils/logger';

// /:matchNumber/:alliance/:seed/:teamNumber/match
// Used to add a team's match to a game
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
            // match.team = team._id;
            // match.matchNumber = matchNumber;
            // match = await Match.create(match);
            match.teamNumber = team.teamNumber;
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

// /:matchNumber/:alliance/:seed/:teamNumber/event
// export const postRobotEvent = catchAsync(
//     async (req: Request, res: Response, next: NextFunction) => {
//         const matchNumber = req.params.matchNumber;
//         const alliance = req.params.alliance;
//         const seed = req.params.seed;
//         const teamNumber = req.params.teamNumber;

//         logger.info(
//             `Adding team state to match ${matchNumber} on the ${alliance} alliance`
//         );

//         let teamEvent = req.body;

//         // Add the match to the game
//         const game = await Game.findOne({ matchNumber });

//         if (game) {
//             if (alliance === 'red' || alliance === 'blue') {
//                 game[alliance].teamEvents.push(teamEvent);
//                 await game.save();
//             } else {
//                 new CustomError(
//                     404,
//                     `Error pushing data to teamEvents for alliance ${alliance}`
//                 );
//             }
//         } else {
//             next(
//                 new CustomError(
//                     404,
//                     `Error accessing game with match number ${matchNumber}`
//                 )
//             );
//         }

//         // const game = await Game.findOneAndUpdate(
//         //     { matchNumber },
//         //     { $set: { [loc]: match._id } },
//         //     { new: true }
//         // );
//         res.status(200).json({
//             status: 'success',
//             data: {
//                 game
//             }
//         });
//     }
// );

// /:matchNumber/:alliance/event
// Pushes a team event to the alliance for a game
export const postTeamEvent = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const matchNumber = req.params.matchNumber;
        const alliance = req.params.alliance;
        logger.info(
            `Adding team state to match ${matchNumber} on the ${alliance} alliance`
        );

        let teamEvent = req.body;

        // Add the match to the game
        const game = await Game.findOne({ matchNumber });

        if (game) {
            if (alliance === 'red' || alliance === 'blue') {
                game[alliance].teamEvents.push(teamEvent);
                await game.save();
            } else {
                new CustomError(
                    404,
                    `Error pushing data to teamEvents for alliance ${alliance}`
                );
            }
        } else {
            next(
                new CustomError(
                    404,
                    `Error accessing game with match number ${matchNumber}`
                )
            );
        }

        // const game = await Game.findOneAndUpdate(
        //     { matchNumber },
        //     { $set: { [loc]: match._id } },
        //     { new: true }
        // );
        res.status(200).json({
            status: 'success',
            data: {
                game
            }
        });
    }
);
