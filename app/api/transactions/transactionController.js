'use strict';

var GeneralResponses       = require('../../components/responses')
var ResponsesTransaction  = require('./transactionResponses');
var Errors          = require('../../components/errors');
var Utils           = require('../../components/utils');
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

exports.sendTransaction = function(request, reply, next) {
  
  LOG.debug('Send Transaction');

  retrieveInterface(request)
    .then(function(data) {
      let txHash = '';
      if(data.body.params)
      {
        let params = [];
        for(var i = 0; i < data.body.params.length; i++) {
          params[i] = data.body.params[i].value;
        }
        params.push({ 'from': data.body.from,
                      'gas': DEFAULT_GAS
                    });
        params.push((err, result) => {
          if(err) {
            LOG.info('Transaction error: '+err);
          } else {
            LOG.debug('Transaction mined'+result);
          }
        });
	txHash = data.contractInstance[data.body.method].apply(data.contractInstance, params);
      } else {
	txHash = data.contractInstance[data.body.method]((err, result) => {
	  if(err) {
	    console.log(err);
	  } else {
  	    console.log(result);
	  }
	});
      }	      
      console.log('Transaction sent. Hash: '+txHash);
      
      LOG.debug('Returning HTTP response');
      return Utils.createReply(reply, ResponsesTransaction.transaction_ok, { transactionID: txHash });
    })
    .fail(function (err) {
      LOG.debug('Error while processing HTTP request');
      return Utils.createReply(reply, ResponsesTransaction.transaction_error);	
    });
};

function retrieveInterface(request) {
  let deferred = Q.defer();

  let data = {};
  fs.readFile(path.join(__dirname, '../../../solidity/build/Voucher.abi'), "utf8", (err, abi) => {
    if(err) {
      deferred.reject(ResponsesContracts.transaction_error);
    } else {
      let contract = WEB3.eth.contract(JSON.parse(abi));
      data.contractInstance = contract.at(request.params.address);
      data.body = request.body;
      deferred.resolve(data);
    }
  });
  return deferred.promise;
}

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

