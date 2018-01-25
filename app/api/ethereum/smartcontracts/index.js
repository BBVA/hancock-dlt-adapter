'use strict';

const express = require('express');
const validate = require('express-jsonschema').validate;
const router = express.Router();

const ContractModel = require('../../../../raml/schemas/smartContract.json');
const TransactionModel = require('../../../../raml/schemas/transaction.json');
const TransactionDeployModel = require('../../../../raml/schemas/transactionDeploy.json');
const TransactionInvokeModel = require('../../../../raml/schemas/transactionInvoke.json');
const smartContractDeploy = require('./controller/deploy');
const smartContractInvoke = require('./controller/invoke');


router.route('/deploy').post(validate({body: TransactionDeployModel}), smartContractDeploy.deploy);
router.route('/invoke').post(validate({body: TransactionInvokeModel}), smartContractInvoke.invoke);

//router.get('/:name', contract.contractInfo(request, reply, next));

// Healthcheck
router.get('/', (req, res) => {
  res.json({
    status: 'OK',
    app: 'Ethereum Smart Contracts'
  });
});

module.exports = router;