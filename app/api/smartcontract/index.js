'use strict';

var express = require('express');
var validate = require('express-jsonschema').validate;
var router = express.Router();

var ContractModel = require('../../../raml/schemas/smartContract.json');
var TransactionModel = require('../../../raml/schemas/transaction.json');
var smartContract = require('./smartContractController');

router.route('/').post(validate({body: ContractModel}), smartContract.create);

router.route('/:address').post(validate({ body: TransactionModel }), smartContract.transaction);

//router.get('/:name', contract.contractInfo(request, reply, next));

module.exports = router
