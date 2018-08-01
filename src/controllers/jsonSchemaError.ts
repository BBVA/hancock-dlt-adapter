import { NextFunction, Request, Response } from 'express';
import { JsonSchemaError, JsonSchemaValidation } from 'express-jsonschema';
import { hancockBadRequestError } from '../models/error';
import { error } from '../utils/error';

export function jsonSchemaError(e: JsonSchemaError, req: Request, res: Response, next: NextFunction) {

  let nextError: Error = e;

  if (e.name === 'JsonSchemaValidation') {

    const newOriginalError: any = new Error();

    newOriginalError.name = e.name;
    newOriginalError.validations = e.validations;
    newOriginalError.message = e.validations.body
      .map((val: JsonSchemaValidation) => `${val.property}[${val.messages.join(', ')}]`)
      .join(' | ')
      .replace(/"/g, '\'');

    nextError = error(hancockBadRequestError, newOriginalError);

  }

  next(nextError);

}
