import { NextFunction, Request, Response } from 'express';
import * as utils from '../../../components/utils';
import * as domain from '../../../domain/ethereum';
import { EthereumSmartContractInternalServerErrorResponse } from '../../../models/ethereum';

export function deleteByQuery(req: Request, res: Response, next: NextFunction) {

  const query: string = req.params.query;

  domain
    .deleteByQuery(query)
    .then(() => utils.createReply(res))
    .catch(() => utils.createReply(res, EthereumSmartContractInternalServerErrorResponse));

}
