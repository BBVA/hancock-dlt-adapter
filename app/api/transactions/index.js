'use strict';

var express = require('express');
var router = express.Router();

var transaction = require('./transactionController');

router.get('/gasprice', transaction.gasPrice(request, reply, next));
router.get('/:txhash', transaction.getTransaction(request, reply, next));
router.get('/block/:block', transaction.getTransactionFromBlock(request, reply, next));
router.get('/:txhash/receipt', transaction.getTransactionReceipt(request, reply, next));
router.post('/', transaction.sendTransaction(request, reply, next));
router.post('/raw', transaction.sendRawTransaction(request, reply, next));
router.post('/call', transaction.call(request, reply, next));
router.post('/estimate', transaction.estimateGas(request, reply, next));

module.exports = router
