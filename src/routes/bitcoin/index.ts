import { Router as ExpressRouter } from 'express';
import { param } from 'express-validator/check';
import * as bitcoinController from '../../controllers/bitcoin';
import { paramValidationError } from '../../controllers/paramValidationError';
import { addressPattern } from '../../utils/bitcoin/utils';
import { transferRouter } from './transfer';

export const router = ExpressRouter();

router
  .param('address', param('address').exists().matches(addressPattern))
  .get('/balance/:address', paramValidationError, bitcoinController.getBalance)
  .use('/transfers', transferRouter);
