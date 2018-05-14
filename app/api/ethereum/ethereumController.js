'use strict';

const GeneralResponses       = require('../../components/responses');
const ResponsesBlock  = require('./ethereumResponses');
const Errors          = require('../../components/errors');
const Utils           = require('../../components/utils');

//var DEFAULT_GAS = 0x50000;

exports.getBalance = (request, reply, next) => {
  new ETH.web3.eth.getBalance(request.params.address, function(err, result) {
    if(err) {
      console.log("Error getting getBalance.");
      return Utils.createReply(reply, ResponsesBlock.ethereum_error);
    } else {
      return Utils.createReply(reply, ResponsesBlock.ethereum_ok, { balance: result});
    }  
  })
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

