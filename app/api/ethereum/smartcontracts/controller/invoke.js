'use strict';

const ResponsesSmartContract = require('../smartContractResponses');
const Utils = require(`${CONF.components}/utils`);
const SmartContract = require(`${CONF.services}/ethereum/smartContract`);

const DEFAULT_GAS = 0x47E7C3;

exports.invoke = (request, reply) => {
  LOG.debug(LOG.logData(request), 'contract invoke ');
  let contractData = {};
  contractData.request = request.body;
  contractData.to = request.body.to;
  SmartContract.retrieveContractAbi(contractData)
    .then(SmartContract.adaptContractInvoke)
    .then((data) => {
      LOG.debug('Returning HTTP response');
      return Utils.createReply(reply, ResponsesSmartContract.success, data);
    })
    .catch((err) => {
      LOG.debug('Error while processing HTTP request');
      console.log(err);
      return Utils.createReply(reply, ResponsesSmartContract.smartcontract_error);
    });
};

exports.invokeByQuery = (request, reply) => {
  const logData = LOG.logData(request);
  LOG.info(logData, `Contract invoke by query: ${request.params.query}`);
  
  let addressPattern = new RegExp(/^0x[a-fA-F0-9]{40}$/i);
  let query = addressPattern.test(request.params.query) ? {address: request.params.query} : {alias: request.params.query};
  
  LOG.debug(logData, `Find contract by query: ${JSON.stringify(query)}`);
  
  const db = DB.get();
  const collection = db.collection(CONF.mongo.collections.smartContracts);
  
  collection.findOne(query)
    .then((result) => {
      if (result) {
        let contractData = {};
        contractData.request = request.body;
        contractData.abi = result.abi;
        contractData.to = result.address;
        SmartContract.adaptContractInvoke(contractData)
          .then((data) => {
            LOG.info(logData, 'Contract invoke adapted. Returning success response');
            return Utils.createReply(reply, ResponsesSmartContract.success, data);
          })
          .catch((error) => {
            LOG.error(logData, `Error while adapting contract invoke: ${error}`);
            return Utils.createReply(reply, ResponsesSmartContract.smartcontract_error);
          });
      } else {
        LOG.info(logData, 'Contract not found');
        return Utils.createReply(reply, ResponsesSmartContract.not_found);
      }
    })
    .catch((error) => {
      LOG.error(logData, `Error invoking contract: ${error}`);
      return Utils.createReply(reply, ResponsesSmartContract.internal_server_error);
    });
};

