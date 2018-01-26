'use strict';

const GeneralResponses       = require('../../components/responses');
const ResponsesBlock  = require('./ethereumResponses');
const Errors          = require('../../components/errors');
const Utils           = require('../../components/utils');

//var DEFAULT_GAS = 0x50000;

exports.getBalance = (request, reply, next) => {
  reply.json({
    status: 'OK',
    app: 'GET Ethereum Balance'
  });
};

exports.getIncentive = (request, reply, next) => {
  reply.json({
    status: 'OK',
    app: 'GET Ethereum Incentive'
  });
};

exports.getReceipt = (request, reply, next) => {
  reply.json({
    status: 'OK',
    app: 'GET Ethereum Receipt'
  });
};

