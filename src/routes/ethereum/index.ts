import { Router as ExpressRouter } from 'express';
import * as ethereumController from '../../controllers/ethereum';
import { smartContractRouter } from './smartContract';
import { tokenRouter } from './token';
import { transferRouter } from './transfer';

export const router = ExpressRouter();

router
  .use('/smartcontracts', smartContractRouter)
  .use('/transfers', transferRouter)
  .get('/balance/:address', ethereumController.getBalance)
  .use('/token', tokenRouter);
