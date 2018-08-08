import { NextFunction, Request, Response } from 'express';
import * as domain from '../../../domain/ethereum/token';
import { ethereumOkTokenResponse } from '../../../models/ethereum';
import { IEthereumTokenBalanceResponse } from '../../../models/ethereum/token';
import * as utils from '../../../utils/utils';

export async function tokenBalanceOf(req: Request, res: Response, next: NextFunction) {

  const address: string = req.query.address;
  const contractAddress: string = req.query.contractAddress;

  return domain
    .tokenBalanceOf(contractAddress, address)
    .then((result: IEthereumTokenBalanceResponse) => utils.createReply(res, ethereumOkTokenResponse, result))
    .catch(next);
}

export async function tokenBalanceOfByQuery(req: Request, res: Response, next: NextFunction) {

  const address: string = req.params.address;
  const addressOrAlias: string = req.params.addressOrAlias;

  return domain
    .tokenBalanceOfByQuery(addressOrAlias, address)
    .then((result: IEthereumTokenBalanceResponse) => utils.createReply(res, ethereumOkTokenResponse, result))
    .catch(next);
}
