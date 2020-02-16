import { Request, Response, NextFunction } from 'express';
import { catchAsync } from '../utils/catchAsync';
import Match from '../models/matchModel';

import { CustomError } from '../utils/error';

export const getAllMatches = catchAsync(
    async (_req: Request, res: Response, _next: NextFunction) => {
        let filter = {};
        // Nested route filtering
        // if (req.params.teamId) {
        //     filter = { team: req.params.teamId };
        // }

        const matches = await Match.find(filter);

        res.status(200).json({
            status: 'success',
            results: matches.length,
            data: {
                matches
            }
        });
    }
);

export const getMatch = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const match = await Match.findById(req.params.id);

        if (!match) {
            return next(new CustomError(404, 'No match with ID found'));
        }

        res.status(200).json({
            status: 'success',
            data: {
                match
            }
        });
    }
);

export const createMatch = catchAsync(
    async (req: Request, res: Response, _next: NextFunction) => {
        // Detect nested routes
        // if (!req.body.team) {
        //     req.body.team = req.params.teamId;
        // }

        const newMatch = await Match.create(req.body);
        res.status(201).json({
            status: 'success',
            data: {
                match: newMatch
            }
        });
    }
);

export const updateMatch = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const match = await Match.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if (!match) {
            return next(new CustomError(404, 'No match with ID found'));
        }

        res.status(200).json({
            status: 'success',
            data: {
                match
            }
        });
    }
);

export const deleteMatch = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const match = await Match.findByIdAndDelete(req.params.id);

        if (!match) {
            return next(new CustomError(404, 'No match with ID found'));
        }

        res.status(204).json({
            status: 'success',
            match
        });
    }
);

export const updateMatchEvent = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const match = await Match.findOne({
            matchNumber: req.params.matchNumber,
            teamNumber: req.params.teamNumber
        });

        if (!match) {
            return next(
                new CustomError(
                    404,
                    'No match with match number and team number found'
                )
            );
        }

        match.robotEvents.push(req.body);
        await match.save();

        res.status(204).json({
            status: 'success',
            data: {
                match
            }
        });
    }
);

export const updateMatchState = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const match = await Match.findOne({
            matchNumber: req.params.matchNumber,
            teamNumber: req.params.teamNumber
        });

        if (!match) {
            return next(
                new CustomError(
                    404,
                    'No match with match number and team number found'
                )
            );
        }

        match.robotStates.push(req.body);
        await match.save();

        res.status(204).json({
            status: 'success',
            data: {
                match
            }
        });
    }
);
