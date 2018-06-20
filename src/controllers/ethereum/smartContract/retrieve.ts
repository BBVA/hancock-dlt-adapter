import { NextFunction, Request, Response } from 'express';
import * as utils from '../../../components/utils';
import * as domain from '../../../domain/ethereum';
import {
  EthereumSmartContractSuccessResponse,
  IEthereumSmartContractInvokeByQueryRequest,
  IEthereumSmartContractInvokeRequest,
} from '../../../models/ethereum';

export function find(req: Request, res: Response, next: NextFunction) {

  const params: IEthereumSmartContractInvokeRequest = req.body;

  domain
    .invoke(params)
    .then((result: any) => utils.createReply(res, EthereumSmartContractSuccessResponse, {list: result}))
    .catch((err: any) => utils.createReply(res, err));

}

export function findOne(req: Request, res: Response, next: NextFunction) {

  const addressOrAlias: string = req.params.query;
  const params: IEthereumSmartContractInvokeByQueryRequest = req.body;

  domain
    .invokeByQuery(addressOrAlias, params)
    .then((result: any) => utils.createReply(res, EthereumSmartContractSuccessResponse, result))
    .catch((err: any) => utils.createReply(res, err));

}
