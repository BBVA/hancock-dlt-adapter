import { NextFunction, Request, Response } from 'express';

export function HealthCheckController(req: Request, res: Response, next: NextFunction) {

  res
    .status(200)
    .json({
      app: CONF.application,
      success: true,
    });

}
