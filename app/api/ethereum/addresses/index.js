'use strict';

var express = require('express');
var router = express.Router();

var address = require('./addressController');

router.get('/transactions/count', address.getTransactionCount(request, reply, next));
router.get('/:address/transactions/count', address.getTransactionCount(request, reply, next));
router.get('/:address/balance', address.getBalance(request, reply, next));
router.get('/:address/storage', address.getStorageAt(request, reply, next));
router.get('/:address/code', address.getCode(request, reply, next));
router.get('/:address/finance', address.getEther(request, reply, next));

module.exports = router
