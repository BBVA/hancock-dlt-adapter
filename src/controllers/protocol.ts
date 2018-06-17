import { NextFunction, Request, Response } from 'express';
import * as responses from '../components/responses';
import * as Utils from '../components/utils';
import * as config from '../utils/config';

const ProtocolResponses = {

  bad_request: {
    code: responses.ndbgeneral400.code,
    message: 'Bad request',
    statusCode: 400,
  },

  request_error: {
    code: responses.ndbgeneral500.code,
    message: 'Request error',
    statusCode: 500,
  },

  request_ok: {
    code: responses.ndbgeneral200.code,
    message: 'Operation successfully requested',
    statusCode: 200,
  },

};

export function decode(request: Request, reply: Response, next: NextFunction) {
  const removedPath = config.protocol.replace('__CODE__', '');
  const dataDecode = JSON.parse(decodeURIComponent(request.body.code.replace(removedPath, '')));
  return Utils.createReply(reply, ProtocolResponses.request_ok, dataDecode);
}

export function encode(request: Request, reply: Response, next: NextFunction) {
  const qrEncode = config.protocol.replace('__CODE__', encodeURIComponent(JSON.stringify(request.body)));
  return Utils.createReply(reply, ProtocolResponses.request_ok, { qrEncode });
}
