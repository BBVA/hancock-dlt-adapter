'use strict';

var express = require('express');
var validate = require('express-jsonschema').validate;
var router = express.Router();

var transaction = require('./transfersController');
// var TransactionModel = require('../../../../raml/schemas/requests/ethereum/transfers/transaction.json');

//router.route('/:address').post(validate({ body: TransactionModel}), transaction.sendTransaction);

// router.get('/gasprice', transaction.gasPrice);
// router.get('/:txhash', transaction.getTransaction);
router.post('/', transaction.sendTransaction);
//router.get('/block/:block', transaction.getTransactionFromBlock(request, reply, next));
//router.get('/:txhash/receipt', transaction.getTransactionReceipt(request, reply, next));
//router.post('/:address', transaction.sendTransaction);
//router.post('/raw', transaction.sendRawTransaction(request, reply, next));
//router.post('/call', transaction.call(request, reply, next));
//router.post('/estimate', transaction.estimateGas(request, reply, next));

module.exports = router
