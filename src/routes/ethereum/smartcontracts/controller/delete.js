'use strict';

const ResponsesSmartContract = require('../smartContractResponses');
const Utils = require(`../../../../components/utils`);

exports.deleteByQuery = (request, reply) => {
  const logData = LOG.info(request);
  LOG.info(logData, `De-registering contract by query: ${request.params.query}`);
  
  const db = DB.get();
  const collection = db.collection(CONF.db.ethereum.collections.smartContracts);
  
  let addressPattern = new RegExp(/^0x[a-fA-F0-9]{40}$/i);
  let query = addressPattern.test(request.params.query) ? {address: request.params.query} : {alias: request.params.query};
  
  collection.findOneAndDelete(query)
    .then((result) => {
      if (result.ok === 1) {
        LOG.info(logData, `Smart contract de-registered`);
        return Utils.createReply(reply);
      } else {
        LOG.error(logData, `Smart contract cannot be de-registered. Result code ${result.ok} and error ${JSON.stringify(result.lastErrorObject)}`);
        return Utils.createReply(reply, ResponsesSmartContract.internal_server_error);
      }
    })
    .catch((error) => {
      LOG.error(logData, `Smart contract cannot be de-registered: ${error}`);
      return Utils.createReply(reply, ResponsesSmartContract.internal_server_error);
    });
};