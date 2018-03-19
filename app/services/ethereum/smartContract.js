'use strict';

const request = require('request');
const ResponsesSmartContract = require('../../api/ethereum/smartcontracts/smartContractResponses');
const ACTIONS = {
  SEND: 'send',
  CALL: 'call'
}
const DEFAULT_ACTION = ACTIONS.SEND;

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

  contractData.contract = new ETH.web3.eth.Contract(contractData.abi, contractData.to);
  const action = contractData.request.action || DEFAULT_ACTION;

  return new Promise((resolve, reject) => {
    LOG.debug('Invoking contract');

    const contractMethod = contractData.contract.methods[contractData.request.method]
      .apply(null, contractData.request.params);

    if (action == ACTIONS.SEND) {

      contractMethod[action].call(null, { from: contractData.request.from }, (error, result) => {
        LOG.debug(`Adapt invoke (${action}) callback`);

        if (error) {
          
          LOG.debug(`Error sending contract (${action}) invocation`);
          reject(error);

        } else {

          LOG.debug(`Contract (${action}) invocation successfully adapted`);
          resolve(result);

        }

      })
        .on('error', console.log)

    } else {

      contractMethod[action].call(null, { from: contractData.request.from }, (error, result) => {
        LOG.debug(`Adapt invoke (${action}) callback`);

        try {

          LOG.debug(`Contract (${action}) invocation successfully adapted`);
          resolve(result);

        } catch (e) {

          LOG.debug(`Error sending contract (${action}) invocation`);
          reject(error);

        }

      });

      // contractMethod[action].call(null, { from: contractData.request.from }, (error) => {
      //   LOG.debug(`Adapt invoke (${action}) callback`);

      //   try {

      //     const result = JSON.parse(error.message);
      //     LOG.debug(`Contract (${action}) invocation successfully adapted`);
      //     resolve(result);

      //   } catch (e) {

      //     LOG.debug(`Error sending contract (${action}) invocation`);
      //     reject(error);

      //   }

      // });

    }

  });
};
