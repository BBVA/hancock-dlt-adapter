import { NextFunction, Request, Response } from 'express';
import * as domain from '../../../domain/ethereum';
import {
  ethereumTokenTransferFromSuccessResponse,
  IEthereumTokenTransferFromByQueryRequest,
  IEthereumTokenTransferFromRequest,
} from '../../../models/ethereum';
import * as utils from '../../../utils/utils';

export async function tokenTransferFrom(req: Request, res: Response, next: NextFunction) {

  const params: IEthereumTokenTransferFromRequest = req.body;

  return domain
    .tokenTransferFrom(params)
    .then((result: any) => utils.createReply(res, ethereumTokenTransferFromSuccessResponse, result))
    .catch((err: any) => utils.createReply(res, err));

}

export async function tokenTransferFromByQuery(req: Request, res: Response, next: NextFunction) {

  const addressOrAlias: string = req.params.query;
  const params: IEthereumTokenTransferFromByQueryRequest = req.body;

  return domain
    .tokenTransferFromByQuery(addressOrAlias, params)
    .then((result: any) => utils.createReply(res, ethereumTokenTransferFromSuccessResponse, result))
    .catch((err: any) => utils.createReply(res, err));

}
