import { NextFunction, Request, Response } from 'express';
import * as domain from '../../../domain/ethereum';
import {
  EthereumTokenTransferSuccessResponse,
  IEthereumERC20TransferRequest,
} from '../../../models/ethereum';
import * as utils from '../../../utils/utils';

export async function tokenTransfer(req: Request, res: Response, next: NextFunction) {

  const params: IEthereumERC20TransferRequest = req.body;

  return domain
    .tokenTransfer(params)
    .then((result: any) => utils.createReply(res, EthereumTokenTransferSuccessResponse, result))
    .catch((err: any) => utils.createReply(res, err));

}
