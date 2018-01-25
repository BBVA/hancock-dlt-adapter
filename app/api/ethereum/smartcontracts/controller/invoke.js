'use strict';

const ResponsesSmartContract = require('../smartContractResponses');
const Utils                  = require('../../../../components/utils');
const SmartContract          = require('../../../../services/ethereum/smartContract');

const DEFAULT_GAS = 0x47E7C3;

exports.invoke = (request, reply) => {
  LOG.debug( LOG.logData(request), 'contract invoke ');
  let contractData = {};
  contractData.request = request.body;
  SmartContract.retrieveContractAbi(contractData)
    .then(SmartContract.adaptContractInvoke)
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