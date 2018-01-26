'use strict';

const ResponsesSmartContract = require('../smartContractResponses');
const Utils = require(`${CONF.components}/utils`);

exports.find = (request, reply) => {
  const logData = LOG.logData(request);
  
  const db = DB.get();
  const collection = db.collection(CONF.mongo.collections.smartContracts);
  
  collection.find().project({_id: 0}).toArray()
    .then((result) => {
      LOG.info(logData, `Listing all resources`);
      return Utils.createReply(reply, ResponsesSmartContract.success, {list: result});
    })
    .catch((error) => {
      LOG.error(logData, `Error retrieving smart contract: ${error}`);
      return Utils.createReply(reply, ResponsesSmartContract.internal_server_error);
    });
};

exports.findOne = (request, reply) => {
  const logData = LOG.logData(request);
  
  const db = DB.get();
  const collection = db.collection(CONF.mongo.collections.smartContracts);
  
  let addressPattern = new RegExp(/^0x[a-fA-F0-9]{40}$/i);
  let query = addressPattern.test(request.params.query) ? {address: request.params.query} : {alias: request.params.query};
  
  LOG.debug(logData, `Find one contract by query: ${JSON.stringify(query)}`);
  
  collection.findOne(query, {_id: 0})
    .then((contract) => {
      if (contract) {
        LOG.info(logData, 'One contract found. Returning success response');
        return Utils.createReply(reply, ResponsesSmartContract.success, contract);
      } else {
        LOG.info(logData, 'Contract not found');
        return Utils.createReply(reply, ResponsesSmartContract.not_found);
      }
    })
    .catch((error) => {
      LOG.error(logData, `Error retrieving smart contract: ${error}`);
      return Utils.createReply(reply, ResponsesSmartContract.internal_server_error);
    });
};