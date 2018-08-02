import { NextFunction, Request, Response } from 'express';
import * as domain from '../../../domain/ethereum';
import {
  ethereumTokenAllowanceSuccessResponse,
  IEthereumTokenAllowanceByQueryRequest,
  IEthereumTokenAllowanceRequest,
} from '../../../models/ethereum';
import * as utils from '../../../utils/utils';

export async function tokenAllowance(req: Request, res: Response, next: NextFunction) {

  const params: IEthereumTokenAllowanceRequest = req.body;

  return domain
    .tokenAllowance(params)
    .then((result: any) => utils.createReply(res, ethereumTokenAllowanceSuccessResponse, result))
    .catch(next);

}

export async function tokenAllowanceByQuery(req: Request, res: Response, next: NextFunction) {

  const addressOrAlias: string = req.params.addressOrAlias;
  const params: IEthereumTokenAllowanceByQueryRequest = req.body;

  return domain
    .tokenAllowanceByQuery(addressOrAlias, params)
    .then((result: any) => utils.createReply(res, ethereumTokenAllowanceSuccessResponse, result))
    .catch(next);

}
