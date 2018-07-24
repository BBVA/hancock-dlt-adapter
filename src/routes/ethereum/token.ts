import { Router as ExpressRouter } from 'express';
import { validate } from 'express-jsonschema';
import { readFileSync } from 'fs';
import * as path from 'path';
import * as smartContractController from '../../controllers/ethereum';

export const tokenRouter = ExpressRouter();

const schemaPath: string = path.normalize(__dirname + '/../../../../raml/schemas');
const registerTokenSchema = JSON.parse(readFileSync(`${schemaPath}/requests/ethereum/token/register.json`, 'utf-8'));
const transferTokenSchema = JSON.parse(readFileSync(`${schemaPath}/requests/ethereum/token/transfer.json`, 'utf-8'));
const transferTokenByQuerySchema = JSON.parse(readFileSync(`${schemaPath}/requests/ethereum/token/transferByQuery.json`, 'utf-8'));
const allowanceTokenSchema = JSON.parse(readFileSync(`${schemaPath}/requests/ethereum/token/allowance.json`, 'utf-8'));
const allowanceTokenByQuerySchema = JSON.parse(readFileSync(`${schemaPath}/requests/ethereum/token/allowanceByQuery.json`, 'utf-8'));
const transferFromTokenSchema = JSON.parse(readFileSync(`${schemaPath}/requests/ethereum/token/transferFrom.json`, 'utf-8'));
const transferFromTokenByQuerySchema = JSON.parse(readFileSync(`${schemaPath}/requests/ethereum/token/transferFromByQuery.json`, 'utf-8'));

tokenRouter
  .get('/:query/balance/:address', smartContractController.getTokenBalance)
  .get('/:query/metadata', smartContractController.getTokenMetadataByQuery)
  .post('/:query/transfer', validate({body: allowanceTokenByQuerySchema}), smartContractController.tokenTransferByQuery)
  .post('/:query/transferFrom', validate({body: transferFromTokenByQuerySchema}), smartContractController.tokenTransferFromByQuery)
  .post('/:query/allowance', validate({body: transferTokenByQuerySchema}), smartContractController.tokenAllowanceByQuery)
  .get('/metadata', smartContractController.getTokenMetadata)
  .post('/transfer', validate({body: transferTokenSchema}), smartContractController.tokenTransfer)
  .post('/register', validate({body: registerTokenSchema}), smartContractController.tokenRegister)
  .post('/transferFrom', validate({body: transferFromTokenSchema}), smartContractController.tokenTransferFrom)
  .post('/allowance', validate({body: allowanceTokenSchema}), smartContractController.tokenAllowance);
