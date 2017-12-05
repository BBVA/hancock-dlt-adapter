'use strict';

const events = require('../../../services/ethereum-events');
const request = require('request');
const ResponsesSmartContract = require('./smartContractResponses');
const Utils                  = require('../../../components/utils');
const fs                     = require('fs');
const path                   = require('path');

const DEFAULT_GAS = 0x47E7C3;

exports.create = (request, reply) => {
  LOG.debug( LOG.logData(request), 'contract create');
  let contractData = {};
  contractData.request = request.body;
  retrieveContractBinary(contractData) // Read the solidity file
    .then(retrieveContractAbi)
    .then(checkContractSender)
    .then(adaptContractDeploy)     // Actually creates the contract in the Ethereum blockchain
    .then((data) => {
      LOG.debug('Returning HTTP response');
      return Utils.createReply(reply, ResponsesSmartContract.smartcontract_ok, data);
    })
    .catch((err) => {
      LOG.debug('Error while processing HTTP request');
      console.log(err);
      return Utils.createReply(reply, ResponsesSmartContract.smartcontract_error);      
    });
};

function retrieveContractBinary(contractData) {
  LOG.debug('Retrieving contract binary');
  return new Promise((resolve, reject) => {
    request(contractData.request.url + '.bin', (error, response, data) => {
      if (error) {
        LOG.debug('Contract binary not found');
        reject(ResponsesSmartContract.sourcecode_not_found_error);
      } else {
        LOG.debug('Contract binary retrieved');
        contractData.bin = data;
        resolve(contractData);
      }
    });
  });
}

function retrieveContractAbi(contractData) {
  LOG.debug('Retrieving contract ABI');
  return new Promise((resolve, reject) => {
    request(contractData.request.url + '.abi', (error, response, data) => {
      if (!error) {
        LOG.debug('Contract ABI retrieved');
        contractData.abi = JSON.parse(data);
        resolve(contractData);
      } else {
        LOG.debug('Contract ABI not found');
        reject(ResponsesSmartContract.sourcecode_not_found_error);
      }
    });
  });
}

function checkContractSender(contractData) {
  LOG.debug('Checking whether contract sender wallet is registered');

  return new Promise((resolve, reject) => {
    LOG.debug('TODO: lookup wallet registry or mongodb');
    resolve(contractData);
  });
}

function adaptContractDeploy(contractData) {
  LOG.debug('Creating contract object');

  /* Send the contract creation transaction. */
  let params = [];
  for(let i = 0; i < contractData.request.params.length; i++) {
    params[i] = contractData.request.params[i].value;
  }

  contractData.contract = new ETH.web3.eth.Contract(contractData.abi);
  return new Promise((resolve, reject) => {
    LOG.debug('Deploying contract');
    contractData.contract
      .deploy({ data: '0x'+contractData.bin, arguments: params})
      .send({ from: contractData.request.from }, (error, result) => {
        LOG.debug('Adapt deploy callback');
        if(error) {
          LOG.debug('Error sending contract deployment');
          reject(error);
        } else {
          LOG.debug('Contract deployment successfully adapted');
          resolve(result);
        }
      })
      .on('error', function(error){ console.log(error); })
      .on('transactionHash', function(transactionHash){ console.log(transactionHash); })
      .on('receipt', function(receipt){
        console.log(receipt.contractAddress) // contains the new contract address
      });
  });
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
    url: CONF.smartcontracts.url+'/transfers',
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
