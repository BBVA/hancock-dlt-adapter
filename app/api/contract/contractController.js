'use strict';

var events             = require('../../services/events');
var request 	       = require('request');
var Solc               = require('solc');
var ResponsesContracts = require('./contractResponses');
var Errors             = require('../../components/errors');
var Utils              = require('../../components/utils');
var Q                  = require('q');
var fs                 = require('fs');
var path               = require('path');

var DEFAULT_GAS = 0x47E7C3;

exports.create = function(request, reply, next) {
  LOG.debug( LOG.logData(request), 'contract create');
  contractCompile(request.body)    // Compiles the source code
    .then(contractSubmit)     // Actually creates the contract in the Ethereum blockchain
    .then(function() {
      LOG.debug('Returning HTTP response');
      return res.status(202).json({ result: 'OK' });
    })
    .fail(function (err) {
      LOG.debug('Error while processing HTTP request');
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
      deferred.reject(ResponsesContracts.transaction_error);
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
    state: 'MINED'
  };
  let options = {
    method: 'POST',
    json: true,
    url: CONF.smartcontracts.url+'/transactions',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify(req)
  }
  LOG.debug(options);
  request(options, (err, resp, body) => {
    if(err) {
      LOG.info('Error in SmartContract transaction webhook request: '+err);
    } else {
      LOG.info('SmartContract transaction webhook request successful: '+resp);
    }
  });
}
