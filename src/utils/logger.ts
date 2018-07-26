import * as pinoLib from 'pino';
import config from '../utils/config';

const pino = pinoLib();

let _logger: pinoLib.Logger;

function init(): pinoLib.Logger {
  _logger = pino.child({
    app: config.application,
    host: config.server.host,
    logLevel: config.logger.logLevel,
  });
  return _logger;
}

export function getLogger(): pinoLib.Logger {

  return _logger
    ? _logger
    : init();

}
