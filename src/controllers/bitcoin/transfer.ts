import { NextFunction, Request, Response } from 'express';
import * as domain from '../../domain/bitcoin';
import {
  bitcoinTransferSyncOkResponse,
  IBitcoinTransferSendRequest,
} from '../../models/bitcoin';
import * as utils from '../../utils/utils';

export async function sendTransfer(req: Request, res: Response, next: NextFunction) {

  const transfer: IBitcoinTransferSendRequest = req.body;

  return domain
    .sendTransfer(transfer)
    .then((result: any) => utils.createReply(res, bitcoinTransferSyncOkResponse, result))
    .catch(next);

}
