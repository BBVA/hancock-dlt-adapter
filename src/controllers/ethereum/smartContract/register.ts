import { NextFunction, Request, Response } from 'express';
import * as utils from '../../../components/utils';
import * as domain from '../../../domain/ethereum';
import { EthereumSmartContractSuccessResponse, IEthereumSmartContractRegisterRequest } from '../../../models/ethereum';

export function register(req: Request, res: Response, next: NextFunction) {

  const params: IEthereumSmartContractRegisterRequest = req.body;

  const alias: string = params.alias;
  const address: string = params.address;
  const abi: any[] = params.abi as any;

  domain
    .register(alias, address, abi)
    .then((result: any) => utils.createReply(res, EthereumSmartContractSuccessResponse, result))
    .catch((err: any) => utils.createReply(res, err));

}
