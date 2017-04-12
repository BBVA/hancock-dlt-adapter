'use strict';

var express = require('express');
var router = express.Router();

var ContractModel = require('./model/contractModel');
var contract = require('./contractController');

router.route('/')
  .post(validate({body: ContractModel.ContractSchema}), contract.create);

//router.get('/:name', contract.contractInfo(request, reply, next));

module.exports = router
