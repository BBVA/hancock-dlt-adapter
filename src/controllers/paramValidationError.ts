import { NextFunction, Request, Response } from 'express';
import { ErrorFormatter, Result, validationResult } from 'express-validator/check';
import { HancockError } from '../models/error';
import { hancockBadRequestError } from '../models/error';
import { error } from '../utils/error';

export function paramValidationError(req: Request, res: Response, next: NextFunction) {

  const result: Result = validationResult(req);

  try {

    result.throw();
    next();

  } catch (e) {

    const record: Record<string, ErrorFormatter> = result.mapped();
    const newOriginalError: any = new Error();

    newOriginalError.name = 'ParamsValidation';
    newOriginalError.validations = record;
    newOriginalError.message = Object.keys(record)
      .map((k: string) => record[k])
      .map((err: any) => `${err.param}[${err.msg}]`)
      .join(' | ')
      .replace(/"/g, '\'');

    const nextError: HancockError = error(hancockBadRequestError, newOriginalError);

    next(nextError);

  }

}
