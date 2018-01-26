'use strict';

const request = require('request');
const ResponsesSmartContract = require('../../api/ethereum/smartcontracts/smartContractResponses');

exports.retrieveContractAbi = (contractData) => {
  LOG.debug('Retrieving contract ABI');
  return new Promise((resolve, reject) => {
    request(contractData.request.urlBase + '.abi', (error, response, data) => {
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
};

exports.adaptContractInvoke = (contractData) => {
  LOG.debug('Adapting contract invoke');

  contractData.contract = new ETH.web3.eth.Contract(contractData.abi, contractData.request.to);

  return new Promise((resolve, reject) => {
    LOG.debug('Invoking contract');

    contractData.contract.methods[contractData.request.method].apply(null, contractData.request.params)
      .send({from: contractData.request.from}, (error, result) => {
      LOG.debug('Adapt invoke callback');
      if (error) {
        LOG.debug('Error sending contract invocation');
        reject(error);
      } else {
        LOG.debug('Contract invocation successfully adapted');
        resolve(result);
      }
    })
      .on('error', function (error) {
      console.log(error);
    })
  });
};