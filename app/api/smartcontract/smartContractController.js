'use strict';

var events                 = require('../../services/events');
var request 	           = require('request');
var Solc                   = require('solc');
var ResponsesSmartContract = require('./smartContractResponses');
var Errors                 = require('../../components/errors');
var Utils                  = require('../../components/utils');
var Q                      = require('q');
var fs                     = require('fs');
var path                   = require('path');

var DEFAULT_GAS = 0x47E7C3;

var errorMsgs = new Map([
  ['-1', "Transaction not allowed in current contract state"], 
  ['-2', "Transaction attempt before due time"],
  ['-3', "Unauthorized transaction sender"]
]);

exports.create = function(request, reply, next) {
  LOG.debug( LOG.logData(request), 'contract create');
  retrieveContract(request.body) // Read the solidity file
    .then(contractCompile)    // Compiles the source code
    .then(contractSubmit)     // Actually creates the contract in the Ethereum blockchain
    .then(function(data) {
      LOG.debug('Returning HTTP response');
      return Utils.createReply(reply, ResponsesSmartContract.smartcontract_ok, { transactionID: data.transactionHash });
    })
    .fail(function (err) {
      LOG.debug('Error while processing HTTP request');
      return Utils.createReply(reply, ResponsesSmartContract.smartcontract_error);      
    });
};

function retrieveContract(body) {
  let deferred = Q.defer();

  var data = {};
  data.body = body;

  LOG.debug('Retrieving solidity file');

  fs.readFile(path.join(__dirname, '../../../solidity/'+data.body.smartContractURL), "utf8", (err, result) => {
    if(err) {
      deferred.reject(ResponsesSmartContracts.sourcecode_not_found_error);
    } else {
      data.solInput = result;
      deferred.resolve(data);
    }
  });

  return deferred.promise;
}

function contractCompile(data) {

  let deferred = Q.defer();

  LOG.debug('Contract Compile');
  /* Compiles the source code with Solidity */

  let output = Solc.compile(data.solInput, 1);
  
  if(!output.contracts[':'+data.body.method]) {
    LOG.debug('Compilation failed');
    deferred.reject(ResponsesSmartContracts.compilation_error);
  } else {      
    LOG.debug('Compilation succeeded');	
    data.abi = JSON.parse(output.contracts[':'+data.body.method].interface); // Add the "compiled" object to data
    data.bytecode = output.contracts[':'+data.body.method].bytecode;
    deferred.resolve(data);
  }
  return deferred.promise;
}

function contractSubmit(data) {
  let deferred = Q.defer();

  LOG.debug('Deploying contract'); 
  /* Send the contract creation transaction. */
  let params = []; 

  console.log(data.body.params);

  for(var i = 0; i < data.body.params.length; i++) {
    params[i] = data.body.params[i].value;
  }
  
  params.push({ 'from': data.body.from,
	        'data': data.bytecode,
		'gas': DEFAULT_GAS
	      });

  params.push((err, result) => {
    if(err) {
      LOG.info('Contract deployment error: '+err);
      deferred.reject(ResponsesSmartContract.deploy_error);
    } else {
      if(!result.address) {
        LOG.debug('Contract transaction sent. TransactionHash: ' + result.transactionHash + ' waiting to be mined...');
	deferred.resolve(result);
      } else {
	contractMinedCallback(data, result);
      }
    }
  });
  

  let contract = WEB3.eth.contract(data.abi);

  contract.new.apply(contract, params);

  return deferred.promise;
}

function contractMinedCallback(data, result) 
{
  LOG.debug('Contract mined. Address: ' + result.address);
  let ethcontract = WEB3.eth.contract(data.abi);
  let contractInstance = ethcontract.at(result.address);
  contractInstance.allEvents({fromBlock: 0, toBlock: 'latest'}, (error, ev) => { events(data, result, error, ev); });
  let req = {
    id: result.transactionHash,
    address: result.address,
    state: 'mined',
    method: data.body.method
  };
  let options = {
    method: 'POST',
    json: true,
    url: CONF.smartcontracts.url+'/transactions',
    headers: {
      'content-type': 'application/json'
    },
    body: req
  }
  request(options, (err, resp, body) => {
    if(err) {
      LOG.info('Error in SmartContract transaction webhook request: '+err);
    } else {
      LOG.info('SmartContract transaction webhook request successful: '+resp);
    }
  });
}

exports.transaction = function(request, reply, next) {
 
  LOG.debug('Transaction controller');

  let transaction = {};

  let params = [];

  for(var i = 0; i < request.body.params.length; i++) {
    params[i] = request.body.params[i].value;
  }
  transaction.params = params;
  transaction.from = request.body.from;
  transaction.method = request.body.method;
  transaction.address = request.params.address;

  retrieveInterface(transaction)
    .then(tryCall)
    .then(sendTransaction)
    .then(function(data) {
      LOG.debug('Returning HTTP response');
      return Utils.createReply(reply, ResponsesSmartContract.transaction_ok, { transactionID: data.hash });
    })
    .fail((err) => {
      LOG.debug('Error while processing HTTP request'+err);
      return Utils.createReply(reply, err);
    });
}

function retrieveInterface(transaction) {

  let deferred = Q.defer();

  LOG.debug('Retrieving ABI');

  fs.readFile(path.join(__dirname, '../../../solidity/abidir/Voucher.abi'), "utf8", (err, abi) => {
    if(err) {
      deferred.reject(ResponsesContracts.transaction_error);
    } else {
      let contract = WEB3.eth.contract(JSON.parse(abi));
      transaction.contractInstance = contract.at(transaction.address);
      deferred.resolve(transaction);
    }
  });

  return deferred.promise;
}

function tryCall(transaction) {
  
  let deferred = Q.defer();

  LOG.debug('Trying transaction call to check correctness');

  let params = transaction.params;

  params.push({ 'from': transaction.from,
                 'gas': DEFAULT_GAS
              });
  params.push((err, result) => {
    if(err) {
      LOG.debug('Error at temptative call transaction');
      deferred.reject(ResponsesSmartContract.transaction_error);
    } else {
      if(result < 0) {
        LOG.debug('Invalid contract invokation. Code: '+errorMsgs.get(result.toString()));
        deferred.reject(ResponsesSmartContract.invalid_transaction_invokation);
      } else {
        LOG.debug('Contract invokation is correct');
        deferred.resolve(transaction);
      }
    }
  });

  transaction.contractInstance[transaction.method].call.apply(transaction.contractInstance, params);

  return deferred.promise;
}
    
function sendTransaction(tx) {
 
  let deferred = Q.defer();

  LOG.debug('Sending Transaction to Blockchain');

  tx.params.push({ 'from': tx.from,
                    'gas': DEFAULT_GAS
                 });
  tx.params.push((err, result) => {
    if(err) {
      LOG.debug('Error while mining transaction');
      deferred.reject(ResponsesSmartContract.transaction_error);
    } else {
      LOG.info('Transaction successful sent');
      tx.hash = result;
      deferred.resolve(tx);
    }
  });
  
  tx.contractInstance[tx.method].sendTransaction.apply(tx.contractInstance, tx.params);

  return deferred.promise;  
}
