import { NextFunction, Request, Response } from 'express';
import * as utils from '../../../components/utils';
import * as domain from '../../../domain/ethereum';
import {
  EthereumSmartContractSmartcontractErrorResponse,
  EthereumSmartContractSuccessResponse,
  IEthereumSmartContractDeployRequest,
} from '../../../models/ethereum';

export function deploy(req: Request, res: Response, next: NextFunction) {

  const params: IEthereumSmartContractDeployRequest = req.body;

  domain
    .deploy(params)
    .then((result: any) => utils.createReply(res, EthereumSmartContractSuccessResponse, result))
    .catch(() => utils.createReply(res, EthereumSmartContractSmartcontractErrorResponse));

}
