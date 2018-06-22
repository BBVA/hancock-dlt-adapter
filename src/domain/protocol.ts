import { IProtocolEncodeRequest } from '../models/protocol';
import config from '../utils/config';

export function decode(data: string): IProtocolEncodeRequest {

  const removedPath = config.protocol.replace('__CODE__', '');
  return JSON.parse(decodeURIComponent(data.replace(removedPath, '')));

}

export function encode(data: IProtocolEncodeRequest): string {

  return config.protocol.replace('__CODE__', encodeURIComponent(JSON.stringify(data)));

}
