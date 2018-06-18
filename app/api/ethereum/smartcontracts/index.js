'use strict';

const express = require('express');
const validate = require('express-jsonschema').validate;
const router = express.Router();

const TransactionDeployModel = require(`${CONF.raml}/schemas/requests/ethereum/smartContracts/transactionDeploy.json`);
const TransactionInvokeModel = require(`${CONF.raml}/schemas/requests/ethereum/smartContracts/transactionInvoke.json`);
const RegisterSmartContractModel = require(`${CONF.raml}/schemas/requests/ethereum/smartContracts/register.json`);
const TransactionInvokeParamModel = require(`${CONF.raml}/schemas/requests/ethereum/smartContracts/transactionInvokeByParam.json`);
const smartContractDeploy = require('./controller/deploy');
const smartContractInvoke = require('./controller/invoke');
const smartContractRegister = require('./controller/register');
const smartContractDelete = require('./controller/delete');
const smartContractRetrieves = require('./controller/retrieves');


router.route('/deploy').post(validate({body: TransactionDeployModel}), smartContractDeploy.deploy);
router.route('/invoke').post(validate({body: TransactionInvokeModel}), smartContractInvoke.invoke);
router.route('/register').post(validate({body: RegisterSmartContractModel}), smartContractRegister.register);
router.route('/:query').post(validate({body: TransactionInvokeParamModel}), smartContractInvoke.invokeByQuery);
router.route('/:query').delete(smartContractDelete.deleteByQuery);
router.route('/').get(smartContractRetrieves.find);
router.route('/:query').get(smartContractRetrieves.findOne);

module.exports = router;