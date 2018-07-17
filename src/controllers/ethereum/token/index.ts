import { NextFunction, Request, Response } from 'express';
import * as domain from '../../../domain/ethereum/token';
import { EthereumErrorTokenResponse, EthereumOkTokenResponse } from '../../../models/ethereum';
import * as utils from '../../../utils/utils';

export * from './register';
export * from './transfer';

export async function getTokenBalance(req: Request, res: Response, next: NextFunction) {

    const address: string = req.params.address;
    const addressOrAlias: string = req.params.scaddress;

    return domain
      .getTokenBalance(address, addressOrAlias)
      .then((balance: number) => utils.createReply(res, EthereumOkTokenResponse, { balance }))
      .catch(() => utils.createReply(res, EthereumErrorTokenResponse));
  }
