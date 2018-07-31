import { NextFunction, Request, Response } from 'express';
import * as domain from '../../../domain/ethereum';
import * as utils from '../../../utils/utils';

export async function deleteByQuery(req: Request, res: Response, next: NextFunction) {

  const query: string = req.params.query;

  return domain
    .deleteByQuery(query)
    .then(() => utils.createReply(res))
    .catch(next);

}
