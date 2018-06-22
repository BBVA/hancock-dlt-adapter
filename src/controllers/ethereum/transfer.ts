import { NextFunction, Request, Response } from 'express';
import * as domain from '../../domain/ethereum';
import {
  EthereumTransferErrorResponse,
  EthereumTransferSyncOkResponse,
  IEthereumTransferSendRequest,
} from '../../models/ethereum';
import * as utils from '../../utils/utils';

export function sendTransfer(req: Request, res: Response, next: NextFunction) {

  const transfer: IEthereumTransferSendRequest = req.body;

  domain
    .sendTransfer(transfer)
    .then((result: any) => utils.createReply(res, EthereumTransferSyncOkResponse, result))
    .catch(() => utils.createReply(res, EthereumTransferErrorResponse));

}
