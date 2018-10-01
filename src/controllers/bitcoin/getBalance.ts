import { NextFunction, Request, Response } from 'express';
import * as domain from '../../domain/bitcoin/getBalance';
import { bitcoinOkResponse } from '../../models/bitcoin';
import * as utils from '../../utils/utils';

export async function getBalance(req: Request, res: Response, next: NextFunction) {

  const address: string = req.params.address;

  return domain
    .getBalance(address)
    .then((balance: string) => utils.createReply(res, bitcoinOkResponse, { balance }))
    .catch(next);

}
