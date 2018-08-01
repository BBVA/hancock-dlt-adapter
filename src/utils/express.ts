import * as bodyParser from 'body-parser';
import * as compression from 'compression';
import * as cors from 'cors';
import * as express from 'express';
import * as methodOverride from 'method-override';

export function getApp() {

  const app = express();

  app.use(cors());
  app.use(bodyParser.json());
  app.use(compression());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(methodOverride());

  return app;
}
