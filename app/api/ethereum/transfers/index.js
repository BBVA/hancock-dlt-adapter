'use strict';

var express = require('express');
var validate = require('express-jsonschema').validate;
var router = express.Router();

var transaction = require('./transfersController');
const TransfersModel = require(`${CONF.raml}/schemas/requests/ethereum/transfers/transfer.json`);

router.post('/', validate({body: TransfersModel}),transaction.sendTransaction);

module.exports = router
