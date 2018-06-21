import { AppRouter } from './routes/index';
import config from './utils/config';
import * as db from './utils/db';
import { Ethereum } from './utils/ethereum/index';
import { getApp } from './utils/express';
import * as logger from './utils/logger';

export async function run() {

  global.LOG = logger.init(config.server.host, config.application, config.logger.logLevel);
  global.ETH = new Ethereum();

  return db
    .connect()
    .then(() => {

      LOG.info('MongoDB connection open');

      const app = getApp();
      app.use(config.server.base, AppRouter);
      app.listen(config.server.port, (error: any) => {

        if (error) {
          return console.error('Service is not available', error);
        }

        console.log('-----------------------------------------------------------------------');
        console.log('Service available in port', config.server.port);
        console.log('-----------------------------------------------------------------------');

      });

    })
    .catch((err: any) => {
      LOG.error(`MongoDB connection error: ${err}`);
      process.exit(1);
    });

}

function exitHook(err?: any) {

  console.log('Exiting gracefully...');

  if (err) {
    console.error(err);
  }

  db
    .close()
    .then(() => {
      LOG.info('MongoDB disconnected through app termination');
      process.exit(0);
    })
    .catch((error: any) => {
      LOG.error(`MongoDB disconnection error: ${error}`);
    });

  process.exit(0);

}

// The app is finishing
process.on('exit', exitHook);
// Catch the SIGINT signal (Ctrl+C)
process.on('SIGINT', exitHook);
// Catch uncaught exceptions from the program
process.on('uncaughtException', exitHook);
