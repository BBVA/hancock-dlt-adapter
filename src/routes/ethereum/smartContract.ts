import { Router as ExpressRouter } from 'express';
import { validate } from 'express-jsonschema';
import { readFileSync } from 'fs';
import * as path from 'path';
import * as smartContractController from '../../controllers/ethereum';

export const smartContractRouter = ExpressRouter();

const schemaPath: string = path.normalize(__dirname + '/../../../../raml/schemas');
const transactionDeploySchema = JSON.parse(readFileSync(`${schemaPath}/requests/ethereum/smartContracts/transactionDeploy.json`, 'utf-8'));
const transactionInvokeSchema = JSON.parse(readFileSync(`${schemaPath}/requests/ethereum/smartContracts/transactionInvoke.json`, 'utf-8'));
const registerSmartContractSchema = JSON.parse(readFileSync(`${schemaPath}/requests/ethereum/smartContracts/register.json`, 'utf-8'));
const transactionInvokeParamSchema = JSON.parse(readFileSync(`${schemaPath}/requests/ethereum/smartContracts/transactionInvokeByParam.json`, 'utf-8'));

smartContractRouter
  .post('/deploy', validate({body: transactionDeploySchema}), smartContractController.deploy)
  .post('/register', validate({body: registerSmartContractSchema}), smartContractController.register)
  .get('/', smartContractController.find)
  .get('/:query', smartContractController.findOne)
  .delete('/:query', smartContractController.deleteByQuery)
  .post('/invoke', validate({body: transactionInvokeSchema}), smartContractController.invoke)
  .post('/:query', validate({body: transactionInvokeParamSchema}), smartContractController.invokeByQuery);
