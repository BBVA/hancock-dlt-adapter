import { Router as ExpressRouter } from 'express';
import { validate } from 'express-jsonschema';
import { param } from 'express-validator/check';
import { readFileSync } from 'fs';
import * as path from 'path';
import * as smartContractController from '../../controllers/ethereum';
import { paramValidationError } from '../../controllers/paramValidationError';

export const smartContractRouter = ExpressRouter();

const schemaPath: string = path.normalize(__dirname + '/../../../../raml/schemas');
const transactionDeploySchema = JSON.parse(readFileSync(`${schemaPath}/requests/ethereum/smartContracts/transactionDeploy.json`, 'utf-8'));
const transactionInvokeSchema = JSON.parse(readFileSync(`${schemaPath}/requests/ethereum/smartContracts/transactionInvoke.json`, 'utf-8'));
const registerSmartContractSchema = JSON.parse(readFileSync(`${schemaPath}/requests/ethereum/smartContracts/register.json`, 'utf-8'));
const transactionInvokeParamSchema = JSON.parse(readFileSync(`${schemaPath}/requests/ethereum/smartContracts/transactionInvokeByParam.json`, 'utf-8'));

smartContractRouter
  .param('addressOrAlias', param('addressOrAlias').exists().isString())
  .post('/deploy', validate({body: transactionDeploySchema}), smartContractController.deploy)
  .post('/register', validate({body: registerSmartContractSchema}), smartContractController.register)
  .get('/', smartContractController.find)
  .get('/:addressOrAlias', paramValidationError, smartContractController.findOne)
  .delete('/:addressOrAlias', paramValidationError, smartContractController.deleteByQuery)
  .post('/invoke', validate({body: transactionInvokeSchema}), smartContractController.invoke)
  .post('/invoke/:addressOrAlias', paramValidationError, validate({body: transactionInvokeParamSchema}), smartContractController.invokeByQuery);
