import { Router } from 'express';
import config from '../utils/config';

import { ErrorController } from '../controllers/error';
import { FallbackController } from '../controllers/fallback';
import { HealthCheckController } from '../controllers/healthcheck';
import { ProtocolRouter } from './protocol';

export const AppRouter = Router();

Object.keys(config.blockchain).forEach((dlt: string) => {

  const router: any = require(`./${dlt}`).Router;

  if (router) {

    AppRouter.use(`/${dlt}`, router);

  }

});

AppRouter
  .use('/health', HealthCheckController)
  .use('/protocol', ProtocolRouter)
  .use(FallbackController)
  .use(ErrorController);
