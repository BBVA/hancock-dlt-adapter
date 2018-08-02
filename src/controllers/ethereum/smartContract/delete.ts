import { NextFunction, Request, Response } from 'express';
import * as domain from '../../../domain/ethereum';
import * as utils from '../../../utils/utils';

export async function deleteByQuery(req: Request, res: Response, next: NextFunction) {

  const addressOrAlias: string = req.params.addressOrAlias;

  return domain
    .deleteByQuery(addressOrAlias)
    .then(() => utils.createReply(res))
    .catch(next);

}
