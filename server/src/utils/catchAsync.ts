import { Request, Response, NextFunction } from 'express';

/**
 * Adds error handling to any asyncronous CRUD function in the controllers
 * @param fn async CRUD function
 */
export const catchAsync = (fn: Function) => {
    return (req: Request, res: Response, next: NextFunction) => {
        fn(req, res, next).catch((err: any) => next(err));
    };
};
