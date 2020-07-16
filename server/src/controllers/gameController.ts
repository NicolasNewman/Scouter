import { Request, Response, NextFunction } from 'express';
import { catchAsync } from '../utils/catchAsync';
import Game from '../models/gameModel';
import { CustomError } from '../utils/error';

// export function middlewareExample(
//     _req: Request,
//     res: Response,
//     next: NextFunction
// ) {
//     if (2 > 3) {
//         return res.status(404).json({
//             status: 'fail',
//             message: 'Invalid ID'
//         });
//     }
//     next();
// }

export const getAllGames = catchAsync(
    async (_req: Request, res: Response, _next: NextFunction) => {
        const games = await Game.find();

        res.status(200).json({
            status: 'success',
            results: games.length,
            data: {
                games
            }
        });
    }
);

export const getGame = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const game = await Game.findOne({
            matchNumber: req.params.matchNumber
        });

        if (!game) {
            return next(
                new CustomError(
                    404,
                    `Could not find game with number ${req.params.matchNumber}`
                )
            );
        }

        res.status(200).json({
            status: 'success',
            data: {
                game
            }
        });
    }
);

export const createGame = catchAsync(
    async (req: Request, res: Response, _next: NextFunction) => {
        const newGame = await Game.create(req.body);

        res.status(201).json({
            status: 'success',
            data: {
                game: newGame
            }
        });
    }
);

export const updateGame = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const game = await Game.findOneAndUpdate(
            { matchNumber: req.params.matchNumber },
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!game) {
            return next(
                new CustomError(
                    404,
                    `Could not find game with number ${req.params.matchNumber}`
                )
            );
        }

        res.status(200).json({
            status: 'success',
            data: {
                game
            }
        });
    }
);

export const updateGameEvent = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const game = await Game.findOne({
            matchNumber: req.params.matchNumber
        });

        if (!game) {
            return next(
                new CustomError(
                    404,
                    `Could not find game with number ${req.params.matchNumber}`
                )
            );
        }

        const alliance = req.params.alliance as 'red' | 'blue';
        game[alliance].teamEvents.push(req.body);
        await game.save();

        res.status(200).json({
            status: 'success',
            data: {
                game
            }
        });
    }
);

export const deleteGame = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const game = await Game.findOneAndDelete({
            matchNumber: req.params.matchNumber
        });

        if (!game) {
            return next(
                new CustomError(
                    404,
                    `Could not find game with number ${req.params.matchNumber}`
                )
            );
        }

        res.status(204).json({
            status: 'success',
            data: game
        });
    }
);
