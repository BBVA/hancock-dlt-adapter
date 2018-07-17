import { Router as ExpressRouter } from 'express';
import { validate } from 'express-jsonschema';
import { readFileSync } from 'fs';
import * as path from 'path';
import * as smartContractController from '../../controllers/ethereum';

export const TokenRouter = ExpressRouter();

const schemaPath: string = path.normalize(__dirname + '/../../../../raml/schemas');
const RegisterTokenSchema = JSON.parse(readFileSync(`${schemaPath}/requests/ethereum/token/register.json`, 'utf-8'));
const TransferTokenSchema = JSON.parse(readFileSync(`${schemaPath}/requests/ethereum/token/transfer.json`, 'utf-8'));
const TransferTokenByQuerySchema = JSON.parse(readFileSync(`${schemaPath}/requests/ethereum/token/transferByQuery.json`, 'utf-8'));

TokenRouter
  .post('/register', validate({body: RegisterTokenSchema}), smartContractController.tokenRegister)
  .post('/transfer', validate({body: TransferTokenSchema}), smartContractController.tokenTransfer)
  .post('/:query/transfer', validate({body: TransferTokenByQuerySchema}), smartContractController.tokenTransferByQuery);
