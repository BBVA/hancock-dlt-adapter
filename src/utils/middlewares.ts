import { NextFunction, Request, Response } from 'express';

export function jsonSchemaValidation(validatorName: string) {
  return (error: any, req: Request, res: Response, next: NextFunction) => {
    if (error.name === validatorName) {

      console.error(error.message);

      res
        .status(400)
        .json({
          result: {
            // code: codes.CODE400.statusCode,
            // description: codes.CODE400.statusText,
            code: 400,
            description: 'Bad Request',
            info: error.validations,
          },
        });

    } else {
      next(error);
    }
  };
}
