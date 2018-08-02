import { Router as ExpressRouter } from 'express';
import { param } from 'express-validator/check';
import * as ethereumController from '../../controllers/ethereum';
import { paramValidationError } from '../../controllers/paramValidationError';
import { addressPattern } from '../../utils/utils';
import { smartContractRouter } from './smartContract';
import { tokenRouter } from './token';
import { transferRouter } from './transfer';

export const router = ExpressRouter();

router
  .param('address', param('address').exists().matches(addressPattern))
  .get('/balance/:address', paramValidationError, ethereumController.getBalance)
  .use('/smartcontracts', smartContractRouter)
  .use('/transfers', transferRouter)
  .use('/token', tokenRouter);
