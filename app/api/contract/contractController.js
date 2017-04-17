'use strict';

var Solc = require('solc');
var ResponsesContracts  = require('./contractResponses');
var Errors          = require('../../components/errors');
var Utils           = require('../../components/utils');
var Q               = require('q');
var fs              = require('fs');
var path            = require('path');

var DEFAULT_GAS = 0x50000;

exports.create = function(request, reply, next) {
  LOG.debug( LOG.logData(request), 'contract create');
  contractCompile(request.body)    // Compiles the source code
    .then(contractSubmit)     // Actually creates the contract in the Ethereum blockchain
    .then(function() {
      return Utils.createReply(reply, ResponsesContracts.eth_web3_ok);
    })
    .fail(function (err) {
      return Utils.createReply(reply, ResponsesContracts.eth_web3_error);      
    });

};

function contractCompile(body) {

  let deferred = Q.defer();
  var data = {};
  data.body = body;

  LOG.debug('Contract Compile');
  /* Compiles the source code with Solidity */

  let solInput = fs.readFileSync(path.join(__dirname, '../../../solidity/'+data.body.smartContractURL), "utf8");

  let output = Solc.compile(solInput, 1);
  
  if(output.contracts.length == 0) {
    LOG.debug('Compilation failed');
    deferred.reject(ResponsesContracts.compilation_error);
  } else {      
    LOG.debug('Compilation succeeded');	  
    data.abi = JSON.parse(output.contracts[data.body.method].interface); // Add the "compiled" object to data
    data.bytecode = output.contracts[data.body.method].bytecode;
    deferred.resolve(data);
  }
  return deferred.promise;
}

function contractSubmit(data) {
  let deferred = Q.defer();

  LOG.debug('Deploying contract'); 
  /* Send the contract creation transaction. */
  console.log(data);
  let params; 

  for(var i = 0; i < data.body.params.length; i++) {
    console.log(i);
    params[i] = data.body.params[i].value;
    console.log(params[i]);
  }
  
  params.push({ 'from': data.body.from,
	        'data': data.bytecode,
		'gas': DEFAULT_GAS
	      });

  params.push((err, result) => {
    if(err) {
      LOG.info('Contract deployment error: '+err);
      deferred.reject(ResponsesContracts.transaction_error);
    } else {
      if(!result.address) {
        LOG.debug('Contract transaction sent. TransactionHash: ' + result.transactionHash + ' waiting to be mined...');
	deferred.resolve(data);
      } else {
	LOG.debug('Contract mined. Address: ' + result.address);
	data.contractAddress = result.address;
      }
    }
  });
  
  console.log(params);

  let contract = WEB3.eth.contract(data.abi);

  console.log(contract);

  contract.new.apply(contract, params);

  return deferred.promise;
}

