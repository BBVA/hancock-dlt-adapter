import { Router as ExpressRouter } from 'express';
import { validate } from 'express-jsonschema';
import { readFileSync } from 'fs';
import * as path from 'path';
import * as transactionController from '../../controllers/ethereum';

export const transferRouter = ExpressRouter();

const schemaPath: string = path.normalize(__dirname + '/../../../../raml/schemas');
const transferSendSchema = JSON.parse(readFileSync(`${schemaPath}/requests/ethereum/transfers/transfer.json`, 'utf-8'));

transferRouter
  .post('/', validate({ body: transferSendSchema }), transactionController.sendTransfer);
