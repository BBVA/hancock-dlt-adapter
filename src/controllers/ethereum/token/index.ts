import { NextFunction, Request, Response } from 'express';
import * as domain from '../../../domain/ethereum/token';
import { EthereumErrorTokenResponse, EthereumOkTokenResponse } from '../../../models/ethereum';
import * as utils from '../../../utils/utils';

export * from './transfer';

export async function getTokenBalance(req: Request, res: Response, next: NextFunction) {

    const address: string = req.params.address;
    const scaddress: string = req.params.scaddress;
    //const alias: string = req.params.alias;
  
    return domain
      .getTokenBalance(address,scaddress)
      .then((balance: number) => utils.createReply(res, EthereumOkTokenResponse, { balance }))
      .catch(() => utils.createReply(res, EthereumErrorTokenResponse));
  
  }