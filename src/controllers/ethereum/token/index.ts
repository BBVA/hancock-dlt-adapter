import { NextFunction, Request, Response } from 'express';
import * as domain from '../../../domain/ethereum/token';
import { EthereumErrorTokenResponse, EthereumOkTokenResponse } from '../../../models/ethereum';
import { IEthereumTokenBalanceResponse } from '../../../models/ethereum/token';
import * as utils from '../../../utils/utils';

export * from './register';
export * from './transfer';

export async function getTokenBalance(req: Request, res: Response, next: NextFunction) {

    const address: string = req.params.address;
    const addressOrAlias: string = req.params.query;

    return domain
      .getTokenBalance(addressOrAlias, address)
      .then((result: IEthereumTokenBalanceResponse) => utils.createReply(res, EthereumOkTokenResponse, result ))
      .catch(() => utils.createReply(res, EthereumErrorTokenResponse));
  }
