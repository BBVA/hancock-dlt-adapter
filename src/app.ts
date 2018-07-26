import { appRouter } from './routes/index';
import config from './utils/config';
import * as db from './utils/db';
import { Ethereum } from './utils/ethereum/index';
import { getApp } from './utils/express';
import * as logger from './utils/logger';

const LOG = logger.getLogger();

export async function run() {

  global.ETH = new Ethereum();

  return db
    .connect()
    .then(() => {

      LOG.info('MongoDB connection open');

      const app = getApp();
      app.use(config.server.base, appRouter);
      app.listen(config.server.port, (error: any) => {

        if (error) {
          return LOG.error('Service is not available', error);
        }

        LOG.info('-----------------------------------------------------------------------');
        LOG.info('Service available in port', config.server.port);
        LOG.info('-----------------------------------------------------------------------');

      });

    })
    .catch((err: any) => {
      LOG.error(`MongoDB connection error: ${err}`);
      process.exit(1);
    });

}

function exitHook(err?: any) {

  LOG.info('Exiting gracefully...');

  if (err) {
    LOG.error(err);
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
