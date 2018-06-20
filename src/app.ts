import { AppRouter } from './routes/index';
import config from './utils/config';
import { Database } from './utils/db';
import { Ethereum } from './utils/ethereum/index';
import { getApp } from './utils/express';
import * as logger from './utils/logger';

export async function run() {

  global.CONF = config;
  global.LOG = logger.init(config.server.host, config.application, config.logger.logLevel);

  let credentials: string = '';

  if (config.db.user && config.db.pass) {
    credentials = `${config.db.user}:${config.db.pass}@`;
  }

  // tslint:disable-next-line:max-line-length
  const url: string = `${config.db.protocol}://${credentials}${config.db.host}:${config.db.port}/${config.db.database}?${config.db.params}`;
  global.DB = new Database(url);
  global.ETH = new Ethereum();

  return DB.connect(CONF.db.database).then(() => {

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

  // const db = DB.get();

  DB.close()
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
