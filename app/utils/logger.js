const pino = require('pino')();

exports.init = (host, app, logLevel) => {
  const child = pino.child({ host, app, logLevel });
  return child;
};
