import { NextFunction, Request, Response } from 'express';
import * as domain from '../../../domain/ethereum';
import {
  EthereumTokenApproveTransferSuccessResponse,
  IEthereumTokenApproveTransferByQueryRequest,
  IEthereumTokenApproveTransferRequest,
} from '../../../models/ethereum';
import * as utils from '../../../utils/utils';

export async function tokenApproveTransfer(req: Request, res: Response, next: NextFunction) {

  const params: IEthereumTokenApproveTransferRequest = req.body;

  return domain
    .tokenApproveTransfer(params)
    .then((result: any) => utils.createReply(res, EthereumTokenApproveTransferSuccessResponse, result))
    .catch((err: any) => utils.createReply(res, err));

}

export async function tokenApproveTransferByQuery(req: Request, res: Response, next: NextFunction) {

  const addressOrAlias: string = req.params.query;
  const params: IEthereumTokenApproveTransferByQueryRequest = req.body;

  return domain
    .tokenApproveTransferByQuery(addressOrAlias, params)
    .then((result: any) => utils.createReply(res, EthereumTokenApproveTransferSuccessResponse, result))
    .catch((err: any) => utils.createReply(res, err));

}
