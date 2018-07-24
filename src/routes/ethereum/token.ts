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
const transferApproveTokenSchema = JSON.parse(readFileSync(`${schemaPath}/requests/ethereum/token/approveTransfer.json`, 'utf-8'));
const transferApproveTokenByQuerySchema = JSON.parse(readFileSync(`${schemaPath}/requests/ethereum/token/approveTransferByQuery.json`, 'utf-8'));

tokenRouter
  .get('/:query/balance/:address', smartContractController.getTokenBalance)
  .post('/approve', validate({body: transferApproveTokenSchema}), smartContractController.tokenApproveTransfer)
  .post('/:query/approve', validate({body: transferApproveTokenByQuerySchema}), smartContractController.tokenApproveTransferByQuery)
  .get('/:query/metadata', smartContractController.getTokenMetadataByQuery)
  .post('/:query/transfer', validate({body: transferTokenByQuerySchema}), smartContractController.tokenTransferByQuery)
  .get('/metadata', smartContractController.getTokenMetadata)
  .post('/transfer', validate({body: transferTokenSchema}), smartContractController.tokenTransfer)
  .post('/register', validate({body: registerTokenSchema}), smartContractController.tokenRegister);
