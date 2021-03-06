import { NextFunction, Request, Response } from 'express';
import * as domain from '../../../domain/ethereum';
import {
  ethereumTokenRegisterSuccessResponse,
  IEthereumTokenRegisterRequest,
} from '../../../models/ethereum';
import * as utils from '../../../utils/utils';

export async function tokenRegister(req: Request, res: Response, next: NextFunction) {

  const params: IEthereumTokenRegisterRequest = req.body;

  return domain
    .tokenRegister(params.alias, params.address)
    .then((result: any) => utils.createReply(res, ethereumTokenRegisterSuccessResponse, result))
    .catch(next);

}
