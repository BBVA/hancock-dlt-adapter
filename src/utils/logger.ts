import * as pinoLib from 'pino';
const pino = pinoLib();

export function init(host: string, app: string, logLevel: string) {
  const child = pino.child({ host, app, logLevel });
  return child;
};
