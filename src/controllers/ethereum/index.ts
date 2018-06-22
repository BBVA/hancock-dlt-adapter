import { NextFunction, Request, Response, Router } from 'express';
import * as utils from '../../components/utils';
import * as domain from '../../domain/ethereum';
import { EthereumErrorResponse, EthereumOkResponse } from '../../models/ethereum';

export function getBalance(req: Request, res: Response, next: NextFunction) {

  const address: string = req.params.address;

  domain
    .getBalance(address)
    .then((balance: number) => utils.createReply(res, EthereumOkResponse, { balance }))
    .catch(() => utils.createReply(res, EthereumErrorResponse));

}

export * from './transfer';
export * from './smartContract';
