'use strict';

var GeneralResponses       = require('../../../components/responses')
var ResponsesTransaction  = require('./transactionResponses');
var Errors          = require('../../../components/errors');
var Utils           = require('../../../components/utils');
var Q               = require('q');
var fs              = require('fs');
var path            = require('path');

var DEFAULT_GAS = 0x47E7C3;

exports.gasPrice = function(request, reply, next) {
  WEB3.eth.getGasPrice(function(err, result) {
    if(err) {
      console.log("Error getting gas price.");
      return Utils.createReply(reply, ResponsesTransaction.transaction_error);
    } else {
      return Utils.createReply(reply, ResponsesTransaction.transaction_sync_ok, { gasPrice: result});
    }  
  })

};

exports.getTransaction = function(request, reply, next) {
  // XXX @todo parse querystring data!!
  WEB3.eth.getTransaction(request.params.txhash, function(err, result) {
    if(err) {
      console.log("Error getting transaction.");
      return Utils.createReply(reply, ResponsesTransaction.transaction_error);
    } else {
      return Utils.createReply(reply, ResponsesTransaction.transaction_sync_ok, { transaction: result});
    }  
  })

};

/*exports.getTransactionFromBlock = function(request, reply, next) {
  var web3 = Utils.getWeb3();
  // XXX @todo parse querystring data!!
  web3.eth.getTransactionFromBlock(request.params.block, request.query.index, function(err, result) {
    if(err) {
      console.log("Error getting transaction from block.");
      return Utils.createReply(reply, ResponsesTransaction.eth_web3_error);
    } else {
      return Utils.createReply(reply, ResponsesTransaction.eth_web3_ok, result);
    }  
  })

};

exports.getTransactionReceipt = function(request, reply, next) {
  var web3 = Utils.getWeb3();
  // XXX @todo parse querystring data!!
  web3.eth.getTransactionReceipt(request.params.txhash, function(err, result) {
    if(err) {
      console.log("Error getting transaction receipt.");
      return Utils.createReply(reply, ResponsesTransaction.eth_web3_error);
    } else {
      return Utils.createReply(reply, ResponsesTransaction.eth_web3_ok, result);
    }  
  })

};*/

/*exports.sendRawTransaction = function(request, reply, next) {
  var data = {
    reqData : {
      method: "POST",
      url: config.ethereum.url+"",
      json: {
        "jsonrpc": "2.0",
        "method": "eth_sendRawTransaction",
        "params": [ request.payload.data ]
      }
    }
  }
  Utils.sendRequest(data) 
  .then(function(data) {
      return Utils.createReply(reply, ResponsesTransaction.eth_web3_ok, data.response.body.result);
  })
  .fail(function(err) {
      return Utils.createReply(reply, ResponsesTransaction.eth_web3_error);    
  })
};

exports.call = function(request, reply, next) {
  var web3 = Utils.getWeb3();
  // XXX @todo parse querystring data!!
  web3.eth.call(request.payload.transaction, function(err, result) {
    if(err) {
      console.log("Error running call.");
      return Utils.createReply(reply, ResponsesTransaction.eth_web3_error);
    } else {
      return Utils.createReply(reply, ResponsesTransaction.eth_web3_ok, result);
    }  
  })

};

exports.estimateGas = function(request, reply, next) {
  var web3 = Utils.getWeb3();
  // XXX @todo parse querystring data!!
  var block = request.query.block;
  if (block === undefined) {
    web3.eth.estimateGas(request.payload.transaction, function(err, result) {
      if(err) {
        console.log("Error estimating gas.");
        return Utils.createReply(reply, ResponsesTransaction.eth_web3_error);
      } else {
        return Utils.createReply(reply, ResponsesTransaction.eth_web3_ok, result);
      }  
    })

  } else {
    web3.eth.estimateGas(request.payload.transaction, block, function(err, result) {
      if(err) {
        console.log("Error estimating gas.");
        return Utils.createReply(reply, ResponsesTransaction.eth_web3_error);
      } else {
        return Utils.createReply(reply, ResponsesTransaction.eth_web3_ok, result);
      }  
    })
  }
}*/

