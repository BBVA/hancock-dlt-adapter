import { appRouter } from './routes/index';
import config from './utils/config';
import * as db from './utils/db';
import { Ethereum } from './utils/ethereum/index';
import { getApp } from './utils/express';
import logger from './utils/logger';

export async function run() {

  global.ETH = new Ethereum();

  return db
    .connect()
    .then(() => {

      logger.info('MongoDB connection open');

      const app = getApp();
      app.use(config.server.base, appRouter);
      app.listen(config.server.port, (error: any) => {

        if (error) {
          return logger.error('Service is not available', error);
        }

        logger.info('Service available in port', config.server.port);

      });

    })
    .catch((err: any) => {
      logger.error(`MongoDB connection error: ${err}`);
      process.exit(1);
    });

}

function exitHook(err?: any) {

  logger.info('Exiting gracefully...');

  if (err) {
    logger.error(err);
  }

  db
    .close()
    .then(() => {
      logger.info('MongoDB disconnected through app termination');
      process.exit(0);
    })
    .catch((error: any) => {
      logger.error(`MongoDB disconnection error: ${error}`);
    });

  process.exit(0);

}

// The app is finishing
process.on('exit', exitHook);
// Catch the SIGINT signal (Ctrl+C)
process.on('SIGINT', exitHook);
// Catch uncaught exceptions from the program
process.on('uncaughtException', exitHook);
// Catch Unhandled promise rejection from the program
process.on('unhandledRejection', exitHook);
