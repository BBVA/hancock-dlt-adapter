import { Router as ExpressRouter } from 'express';
import * as ethereumController from '../../controllers/ethereum';
import { SmartContractRouter } from './smartContract';
import { TokenRouter } from './token';
import { TransferRouter } from './transfer';

export const Router = ExpressRouter();

Router
  .use('/smartcontracts', SmartContractRouter)
  .use('/transfers', TransferRouter)
  .get('/balance/:address', ethereumController.getBalance)
  .use('/token', TokenRouter);
