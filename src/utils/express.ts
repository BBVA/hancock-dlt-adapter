import * as bodyParser from 'body-parser';
import * as compression from 'compression';
import * as cors from 'cors';
import * as errorHandler from 'errorhandler';
import * as express from 'express';
import * as methodOverride from 'method-override';
import * as middlewares from './middlewares';

export function getApp() {

  const app = express();

  app.use(cors());
  app.use(bodyParser.json());

  const env = app.get('env');

  app.use(compression());
  app.use(middlewares.jsonSchemaValidation('JsonSchemaValidation'));
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(methodOverride());

  if ('development' === env || 'test' === env) {
    app.use(errorHandler()); // Error handler - has to be last
  }

  return app;
}
