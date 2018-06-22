import { Router as ExpressRouter } from 'express';
import { validate } from 'express-jsonschema';
import { readFileSync } from 'fs';
import * as path from 'path';
import * as transactionController from '../../controllers/ethereum';

export const TransferRouter = ExpressRouter();

const schemaPath: string = path.normalize(__dirname + '/../../../../raml/schemas');
const TransferSendSchema = JSON.parse(readFileSync(`${schemaPath}/requests/ethereum/transfers/transfer.json`, 'utf-8'));

TransferRouter
  .post('/', validate({ body: TransferSendSchema }), transactionController.sendTransfer);
