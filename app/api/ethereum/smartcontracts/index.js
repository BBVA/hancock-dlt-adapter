'use strict';

const express = require('express');
const validate = require('express-jsonschema').validate;
const router = express.Router();

const ContractModel = require('../../../../raml/schemas/smartContract.json');
const TransactionModel = require('../../../../raml/schemas/transaction.json');
const smartContract = require('./smartContractController');

router.route('/').post(validate({body: ContractModel}), smartContract.create);
router.route('/:address').post(validate({body: TransactionModel}), smartContract.transaction);

//router.get('/:name', contract.contractInfo(request, reply, next));

// Healthcheck
router.get('/', (req, res) => {
  res.json({
    status: 'OK',
    app: 'Ethereum Smart Contracts'
  });
});

module.exports = router;