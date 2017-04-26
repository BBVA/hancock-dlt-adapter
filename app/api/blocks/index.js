'use strict';

var express = require('express');
var router = express.Router();

var block = require('./blockController');

router.get('/number', block.getBlockNumber(request, reply, next));
router.get('/:blockid', block.getBlock(request, reply, next));
router.get('/:blockid/transactions/count', block.getBlockTransactionCount(request, reply, next));
router.get('/:blockid/uncle', block.getUncle(request, reply, next));

module.exports = router
