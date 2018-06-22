import { NextFunction, Request, Response } from 'express';
import * as domain from '../domain/protocol';
import { IProtocolDecodeRequest, IProtocolEncodeRequest, ProtocolRequestOkResponse } from '../models/protocol';
import * as utils from '../utils/utils';

export function decode(req: Request, res: Response, next: NextFunction) {

  const body: IProtocolDecodeRequest = req.body;
  const dataDecode: IProtocolEncodeRequest = domain.decode(body.code);
  return utils.createReply(res, ProtocolRequestOkResponse, dataDecode);

}

export function encode(req: Request, res: Response, next: NextFunction) {

  const body: IProtocolEncodeRequest = req.body;
  const qrEncode: string = domain.encode(body);
  return utils.createReply(res, ProtocolRequestOkResponse, { qrEncode });

}
