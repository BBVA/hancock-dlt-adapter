import { NextFunction, Request, Response } from 'express';
import * as domain from '../../../domain/ethereum';
import { EthereumSmartContractSuccessResponse } from '../../../models/ethereum';
import * as utils from '../../../utils/utils';

export async function find(req: Request, res: Response, next: NextFunction) {

  return domain
    .find()
    .then((result: any) => utils.createReply(res, EthereumSmartContractSuccessResponse, { list: result }))
    .catch((err: any) => utils.createReply(res, err));

}

export async function findOne(req: Request, res: Response, next: NextFunction) {

  const addressOrAlias: string = req.params.query;

  return domain
    .findOne(addressOrAlias)
    .then((result: any) => utils.createReply(res, EthereumSmartContractSuccessResponse, result))
    .catch((err: any) => utils.createReply(res, err));

}
