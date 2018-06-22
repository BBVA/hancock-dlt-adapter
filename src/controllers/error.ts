import { NextFunction, Request, Response, Router } from 'express';

export interface ICustomError {
  code_internal: string;
  code_http: number;
  message: string;
}

export interface IErrorMap {
  [k: string]: ICustomError;
}

export enum Errors {
  DEFAULT_ERROR = 'DEFAULT_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  DLT_ERROR = 'DLT_ERROR',
  PROVIDER_ERROR = 'PROVIDER_ERROR',
}

export const ErrorMap: IErrorMap = {
  DEFAULT_ERROR: { code_internal: 'DC4000', code_http: 400, message: 'Bad request' },
  DLT_ERROR: { code_internal: 'DC5030', code_http: 503, message: 'Service Unavailable' },
  NOT_FOUND: { code_internal: 'DC4040', code_http: 404, message: 'Not Found' },
  PROVIDER_ERROR: { code_internal: 'DC5030', code_http: 503, message: 'Service Unavailable' },
};

export function ErrorController(error: any, req: Request, res: Response, next: NextFunction) {

  const customError: ICustomError = ErrorMap[error.message] || ErrorMap[Errors.DEFAULT_ERROR];
  // const logger = loggerUtils.getLogger(customError.code_internal);

  console.log('-----------------------------------------------------------------------');
  console.error(customError.message);
  console.error(error);
  console.log('-----------------------------------------------------------------------');

  return res
    .status(customError.code_http)
    .json(customError);

}
