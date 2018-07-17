import { NextFunction, Request, Response } from 'express';
import * as domain from '../../../domain/ethereum';
import {
  EthereumTokenTransferSuccessResponse,
  IEthereumTokenTransferByQueryRequest,
  IEthereumTokenTransferRequest,
} from '../../../models/ethereum';
import * as utils from '../../../utils/utils';

export async function tokenTransfer(req: Request, res: Response, next: NextFunction) {

  const params: IEthereumTokenTransferRequest = req.body;

  return domain
    .tokenTransfer(params)
    .then((result: any) => utils.createReply(res, EthereumTokenTransferSuccessResponse, result))
    .catch((err: any) => utils.createReply(res, err));

}

export async function tokenTransferByQuery(req: Request, res: Response, next: NextFunction) {

  const addressOrAlias: string = req.params.query;
  const params: IEthereumTokenTransferByQueryRequest = req.body;

  return domain
    .tokenTransferByQuery(addressOrAlias, params)
    .then((result: any) => utils.createReply(res, EthereumTokenTransferSuccessResponse, result))
    .catch((err: any) => utils.createReply(res, err));

}
