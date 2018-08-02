import { NextFunction, Request, Response } from 'express';
import * as domain from '../../../domain/ethereum';
import {
  ethereumTokenApproveTransferSuccessResponse,
  IEthereumTokenApproveTransferByQueryRequest,
  IEthereumTokenApproveTransferRequest,
} from '../../../models/ethereum';
import * as utils from '../../../utils/utils';

export async function tokenApproveTransfer(req: Request, res: Response, next: NextFunction) {

  const params: IEthereumTokenApproveTransferRequest = req.body;

  return domain
    .tokenApproveTransfer(params)
    .then((result: any) => utils.createReply(res, ethereumTokenApproveTransferSuccessResponse, result))
    .catch(next);

}

export async function tokenApproveTransferByQuery(req: Request, res: Response, next: NextFunction) {

  const addressOrAlias: string = req.params.addressOrAlias;
  const params: IEthereumTokenApproveTransferByQueryRequest = req.body;

  return domain
    .tokenApproveTransferByQuery(addressOrAlias, params)
    .then((result: any) => utils.createReply(res, ethereumTokenApproveTransferSuccessResponse, result))
    .catch(next);

}
