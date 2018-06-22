import { Router as ExpressRouter } from 'express';
import { validate } from 'express-jsonschema';
import { readFileSync } from 'fs';
import * as path from 'path';
import * as smartContractController from '../../controllers/ethereum';

export const SmartContractRouter = ExpressRouter();

const schemaPath: string = path.normalize(__dirname + '/../../../../raml/schemas');
// tslint:disable-next-line:max-line-length
const TransactionDeploySchema = JSON.parse(readFileSync(`${schemaPath}/requests/ethereum/smartContracts/transactionDeploy.json`, 'utf-8'));
// tslint:disable-next-line:max-line-length
const TransactionInvokeSchema = JSON.parse(readFileSync(`${schemaPath}/requests/ethereum/smartContracts/transactionInvoke.json`, 'utf-8'));
// tslint:disable-next-line:max-line-length
const RegisterSmartContractSchema = JSON.parse(readFileSync(`${schemaPath}/requests/ethereum/smartContracts/register.json`, 'utf-8'));
// tslint:disable-next-line:max-line-length
const TransactionInvokeParamSchema = JSON.parse(readFileSync(`${schemaPath}/requests/ethereum/smartContracts/transactionInvokeByParam.json`, 'utf-8'));

SmartContractRouter
  .post('/deploy', validate({body: TransactionDeploySchema}), smartContractController.deploy)
  .post('/register', validate({body: RegisterSmartContractSchema}), smartContractController.register)
  .get('/', smartContractController.find)
  .get('/:query', smartContractController.findOne)
  .delete('/:query', smartContractController.deleteByQuery)
  .post('/invoke', validate({body: TransactionInvokeSchema}), smartContractController.invoke)
  .post('/:query', validate({body: TransactionInvokeParamSchema}), smartContractController.invokeByQuery);
