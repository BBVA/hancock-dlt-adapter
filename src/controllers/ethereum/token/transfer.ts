import { NextFunction, Request, Response } from 'express';
import * as domain from '../../../domain/ethereum';
import {
  ethereumTokenTransferSuccessResponse,
  IEthereumTokenTransferByQueryRequest,
  IEthereumTokenTransferRequest,
} from '../../../models/ethereum';
import * as utils from '../../../utils/utils';

export async function tokenTransfer(req: Request, res: Response, next: NextFunction) {

  const params: IEthereumTokenTransferRequest = req.body;

  return domain
    .tokenTransfer(params)
    .then((result: any) => utils.createReply(res, ethereumTokenTransferSuccessResponse, result))
    .catch(next);

}

export async function tokenTransferByQuery(req: Request, res: Response, next: NextFunction) {

  const addressOrAlias: string = req.params.addressOrAlias;
  const params: IEthereumTokenTransferByQueryRequest = req.body;

  return domain
    .tokenTransferByQuery(addressOrAlias, params)
    .then((result: any) => utils.createReply(res, ethereumTokenTransferSuccessResponse, result))
    .catch(next);

}
