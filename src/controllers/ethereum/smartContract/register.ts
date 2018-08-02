import { NextFunction, Request, Response } from 'express';
import * as domain from '../../../domain/ethereum';
import { ethereumSmartContractSuccessResponse, IEthereumSmartContractRegisterRequest } from '../../../models/ethereum';
import * as utils from '../../../utils/utils';

export async function register(req: Request, res: Response, next: NextFunction) {

  const params: IEthereumSmartContractRegisterRequest = req.body;

  const alias: string = params.alias;
  const address: string = params.address;
  const abi: any[] = params.abi as any;

  return domain
    .register(alias, address, abi)
    .then((result: any) => utils.createReply(res, ethereumSmartContractSuccessResponse, result))
    .catch(next);

}
