'use strict';

var express = require('express');
var validate = require('express-jsonschema').validate;
var router = express.Router();

var transaction = require('./transfersController');

const schemaPath = path.normalize(__dirname + '/../../raml/schemas');
const TransfersModel = require(`${schemaPath}/requests/ethereum/transfers/transfer.json`);
router.post('/', validate({body: TransfersModel}),transaction.sendTransaction);

module.exports = router
