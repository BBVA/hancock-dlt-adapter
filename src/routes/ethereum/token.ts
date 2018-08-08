import { Router as ExpressRouter } from 'express';
import { validate } from 'express-jsonschema';
import { param } from 'express-validator/check';
import { readFileSync } from 'fs';
import * as path from 'path';
import * as scController from '../../controllers/ethereum';
import { paramValidationError } from '../../controllers/paramValidationError';
import { addressPattern } from '../../utils/utils';

export const tokenRouter = ExpressRouter();

const schemaPath: string = path.normalize(__dirname + '/../../../../raml/schemas');
const registerTokenSchema = JSON.parse(readFileSync(`${schemaPath}/requests/ethereum/token/register.json`, 'utf-8'));
const transferTokenSchema = JSON.parse(readFileSync(`${schemaPath}/requests/ethereum/token/transfer.json`, 'utf-8'));
const transferTokenByQuerySchema = JSON.parse(readFileSync(`${schemaPath}/requests/ethereum/token/transferByQuery.json`, 'utf-8'));
const transferApproveTokenSchema = JSON.parse(readFileSync(`${schemaPath}/requests/ethereum/token/approveTransfer.json`, 'utf-8'));
const transferApproveTokenByQuerySchema = JSON.parse(readFileSync(`${schemaPath}/requests/ethereum/token/approveTransferByQuery.json`, 'utf-8'));
const allowanceTokenSchema = JSON.parse(readFileSync(`${schemaPath}/requests/ethereum/token/allowance.json`, 'utf-8'));
const allowanceTokenByQuerySchema = JSON.parse(readFileSync(`${schemaPath}/requests/ethereum/token/allowanceByQuery.json`, 'utf-8'));
const transferFromTokenSchema = JSON.parse(readFileSync(`${schemaPath}/requests/ethereum/token/transferFrom.json`, 'utf-8'));
const transferFromTokenByQuerySchema = JSON.parse(readFileSync(`${schemaPath}/requests/ethereum/token/transferFromByQuery.json`, 'utf-8'));

tokenRouter
  .param('addressOrAlias', param('addressOrAlias').exists().isString())
  .param('address', param('address').exists().matches(addressPattern))
  .post('/register', validate({body: registerTokenSchema}), scController.tokenRegister)
  .get('/:addressOrAlias/metadata', paramValidationError, scController.getTokenMetadataByQuery)
  .get('/:addressOrAlias/balance/:address', paramValidationError, scController.tokenBalanceOfByQuery)
  .post('/:addressOrAlias/transfer', paramValidationError, validate({body: transferTokenByQuerySchema}), scController.tokenTransferByQuery)
  .post('/:addressOrAlias/transferFrom', paramValidationError, validate({body: transferFromTokenByQuerySchema}), scController.tokenTransferFromByQuery)
  .post('/:addressOrAlias/approve', paramValidationError, validate({body: transferApproveTokenByQuerySchema}), scController.tokenApproveTransferByQuery)
  .post('/:addressOrAlias/allowance', paramValidationError, validate({body: allowanceTokenByQuerySchema}), scController.tokenAllowanceByQuery)
  .get('/metadata', scController.getTokenMetadata)
  .get('/balance', paramValidationError, scController.tokenBalanceOf)
  .post('/transfer', validate({body: transferTokenSchema}), scController.tokenTransfer)
  .post('/transferFrom', validate({body: transferFromTokenSchema}), scController.tokenTransferFrom)
  .post('/approve', validate({body: transferApproveTokenSchema}), scController.tokenApproveTransfer)
  .post('/allowance', validate({body: allowanceTokenSchema}), scController.tokenAllowance)
  .delete('/:addressOrAlias', paramValidationError, scController.tokenDeleteByQuery);
