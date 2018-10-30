import { NextFunction, Request, Response } from 'express';
import * as domain from '../../../domain/ethereum';
import {
  ethereumTokenFindAllSuccessResponse,
} from '../../../models/ethereum';
import * as utils from '../../../utils/utils';

export async function tokenFindAll(req: Request, res: Response, next: NextFunction) {

  return domain
    .tokenFindAll()
    .then((result: any) => utils.createReply(res, ethereumTokenFindAllSuccessResponse, result))
    .catch(next);

}
