'use strict';

var express = require('express');
var validate = require('express-jsonschema').validate;
var router = express.Router();

var ContractModel = require('../../../raml/schemas/smartContract.json');
var contract = require('./contractController');

router.route('/')
  .post(validate({body: ContractModel}), contract.create);

//router.get('/:name', contract.contractInfo(request, reply, next));

module.exports = router
