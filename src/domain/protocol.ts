import { IProtocolEncodeRequest } from '../models/protocol';
import config from '../utils/config';
import { error } from '../utils/error';
import logger from '../utils/logger';
import { hancockProtocolDecodeError, hancockProtocolEncodeError } from './models/error';

export function decode(data: string): IProtocolEncodeRequest {

  try {

    const removedPath = config.protocol.replace('__CODE__', '');
    return JSON.parse(decodeURIComponent(data.replace(removedPath, '')));

  } catch (err) {

    logger.error(err);
    throw error(hancockProtocolDecodeError, err);

  }

}

export function encode(data: IProtocolEncodeRequest): string {

  try {

    return config.protocol.replace('__CODE__', encodeURIComponent(JSON.stringify(data)));

  } catch (err) {

    logger.error(err);
    throw error(hancockProtocolEncodeError, err);

  }

}
