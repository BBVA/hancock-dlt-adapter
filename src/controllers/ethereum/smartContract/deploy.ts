import { NextFunction, Request, Response } from 'express';
import * as domain from '../../../domain/ethereum';
import {
  ethereumSmartContractSuccessResponse,
  IEthereumSmartContractDeployRequest,
} from '../../../models/ethereum';
import * as utils from '../../../utils/utils';

export async function deploy(req: Request, res: Response, next: NextFunction) {

  const params: IEthereumSmartContractDeployRequest = req.body;

  return domain
    .deploy(params)
    .then((result: any) => utils.createReply(res, ethereumSmartContractSuccessResponse, result))
    .catch(next);

}
