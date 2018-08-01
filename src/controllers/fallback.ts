import { NextFunction, Request, Response } from 'express';
import { hancockDefaultError } from '../models/error';
import { errorController } from './error';

export function fallbackController(req: Request, res: Response, next: NextFunction) {

  return errorController(hancockDefaultError, req, res, next);

}
