'use strict';

const ResponsesSmartContract = require('../smartContractResponses');
const Utils = require(`${CONF.components}/utils`);

exports.register = (request, reply) => {
  const db = DB.get();
  const collection = db.collection(CONF.mongo.collections.smartContracts);
  
  collection.findOne({alias: request.body.alias})
    .then((result) => {
      if (!result) {
        collection.insertOne(request.body)
          .then((res) => {
            LOG.info(LOG.logData(request), `smart contract registered as ${request.body.alias}`);
            return Utils.createReply(reply, ResponsesSmartContract.created);
          })
          .catch((error) => {
            LOG.error(LOG.logData(request), `smart contract ${request.body.alias} cannot be registered: ${error}`);
            return Utils.createReply(reply, ResponsesSmartContract.internal_server_error);
          });
      } else {
        return Utils.createReply(reply, ResponsesSmartContract.conflict);
      }
    })
    .catch((error) => {
      LOG.error(LOG.logData(request), `smart contract ${request.body.alias} cannot be registered: ${error}`);
      return Utils.createReply(reply, ResponsesSmartContract.internal_server_error);
    });
};