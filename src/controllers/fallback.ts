import { NextFunction, Request, Response } from 'express';
import { errorController, hancockDefaultError } from './error';

export function fallbackController(req: Request, res: Response, next: NextFunction) {

  return errorController(hancockDefaultError, req, res, next);

}
