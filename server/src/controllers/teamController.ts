import { Request, Response, NextFunction } from 'express';
import { catchAsync } from '../utils/catchAsync';
import Team from '../models/teamModel';
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

export const getAllTeams = catchAsync(
    async (_req: Request, res: Response, _next: NextFunction) => {
        const teams = await Team.find();

        res.status(200).json({
            status: 'success',
            results: teams.length,
            data: {
                teams
            }
        });
    }
);

export const getTeam = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const team = await Team.findOne({ teamNumber: req.params.teamNumber });

        if (!team) {
            return next(
                new CustomError(
                    404,
                    `Could not find team with number ${req.params.teamNumber}`
                )
            );
        }

        res.status(200).json({
            status: 'success',
            data: {
                team
            }
        });
    }
);

export const createTeam = catchAsync(
    async (req: Request, res: Response, _next: NextFunction) => {
        const newTeam = await Team.create(req.body);

        res.status(201).json({
            status: 'success',
            data: {
                team: newTeam
            }
        });
    }
);

export const updateTeam = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const team = await Team.findOneAndUpdate(
            { teamNumber: req.params.teamNumber },
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!team) {
            return next(
                new CustomError(
                    404,
                    `Could not find team with number ${req.params.teamNumber}`
                )
            );
        }

        res.status(200).json({
            status: 'success',
            data: {
                team
            }
        });
    }
);

export const deleteTeam = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const team = await Team.findOneAndDelete({
            teamNumber: req.params.teamNumber
        });

        if (!team) {
            return next(
                new CustomError(
                    404,
                    `Could not find team with number ${req.params.teamNumber}`
                )
            );
        }

        res.status(204).json({
            status: 'success',
            data: team
        });
    }
);
