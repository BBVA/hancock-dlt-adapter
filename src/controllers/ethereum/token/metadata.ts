import { NextFunction, Request, Response } from 'express';
import * as domain from '../../../domain/ethereum';
import {
  EthereumTokenMetadataSuccessResponse,
} from '../../../models/ethereum';
import * as utils from '../../../utils/utils';

export async function getTokenMetadata(req: Request, res: Response, next: NextFunction) {

  const addressOrAlias: string = req.params.query;

  return domain
    .getTokenMetadata(addressOrAlias)
    .then((result: any) => utils.createReply(res, EthereumTokenMetadataSuccessResponse, result))
    .catch((err: any) => utils.createReply(res, err));

}
