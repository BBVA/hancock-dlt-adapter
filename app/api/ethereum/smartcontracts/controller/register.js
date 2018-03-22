'use strict';

const ResponsesSmartContract = require('../smartContractResponses');
const Utils = require(`${CONF.components}/utils`);

exports.register = async (request, reply) => {

  const logData = LOG.info(request);

  function onError(error) {
    LOG.error(logData, `Smart contract ${request.body.alias} cannot be registered: ${error}`);
    return Utils.createReply(reply, ResponsesSmartContract.internal_server_error);
  }

  const db = DB.get();
  const collection = db.collection(CONF.mongo.collections.smartContracts);

  const address = request.body.address;
  const alias = request.body.alias

  try {

    const addressResult = await collection.findOne({ address });

    if (!addressResult) {

      const aliasResult = await collection.findOne({ alias });

      if (aliasResult) {

        const numVersions = await collection.count({ alias: { $regex: `^${alias}@` } });
        const newAlias = `${alias}@${numVersions + 1}`;

        await collection.update({ alias }, { $set: { alias: newAlias } });

      }

      const insert = await collection.insertOne(request.body);

      if (insert && insert.result.ok) {

        LOG.info(logData, `Smart contract registered as ${request.body.alias}`);
        return Utils.createReply(reply, ResponsesSmartContract.created);

      }

    } else {

      return Utils.createReply(reply, ResponsesSmartContract.conflict);

    }

  } catch (error) {

    return onError(error);

  }

};
