'use strict';

const request = require('request');
const ResponsesSmartContract = require('../smartContractResponses');
const Utils                  = require('../../../../components/utils');
const SmartContract          = require('../../../../services/ethereum/smartContract');

exports.deploy = (request, reply) => {
  LOG.debug( LOG.logData(request), 'contract deploy');
  let contractData = {};
  contractData.request = request.body;
  retrieveContractBinary(contractData) // Read the solidity file
    .then(SmartContract.retrieveContractAbi)
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
    request(contractData.request.urlBase + '.bin', (error, response, data) => {
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

function adaptContractDeploy(contractData) {
  LOG.debug('Adapting contract deploy');

  contractData.contract = new ETH.web3.eth.Contract(contractData.abi);
  return new Promise((resolve, reject) => {
    LOG.debug('Deploying contract');

    contractData.contract.deploy({ data: '0x'+contractData.bin, arguments: contractData.request.params})
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
  });
}