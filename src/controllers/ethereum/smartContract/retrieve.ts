import { NextFunction, Request, Response } from 'express';
import * as domain from '../../../domain/ethereum';
import { EthereumSmartContractSuccessResponse } from '../../../models/ethereum';
import * as utils from '../../../utils/utils';

export function find(req: Request, res: Response, next: NextFunction) {

  domain
    .find()
    .then((result: any) => utils.createReply(res, EthereumSmartContractSuccessResponse, { list: result }))
    .catch((err: any) => utils.createReply(res, err));

}

export function findOne(req: Request, res: Response, next: NextFunction) {

  const addressOrAlias: string = req.params.query;

  domain
    .findOne(addressOrAlias)
    .then((result: any) => utils.createReply(res, EthereumSmartContractSuccessResponse, result))
    .catch((err: any) => utils.createReply(res, err));

}
