import { Collection, FindAndModifyWriteOpResultObject } from 'mongodb';
import { EthereumSmartContractInternalServerErrorResponse } from '../../../models/ethereum/smartContract';
import config from '../../../utils/config';

export async function deleteByQuery(addressOrAlias: string): Promise<void> {

  LOG.info(`De-registering contract by query: ${addressOrAlias}`);

  const db = DB.get();
  const collection: Collection = db.collection(config.db.ethereum.collections.smartContracts);

  const addressPattern: RegExp = new RegExp(/^0x[a-fA-F0-9]{40}$/i);
  const query: any = addressPattern.test(addressOrAlias) ? {address: addressOrAlias} : {alias: addressOrAlias};

  collection
    .findOneAndDelete(query)
    .then((result: FindAndModifyWriteOpResultObject) => {

      if (result.ok === 1) {

        LOG.info(`Smart contract de-registered`);
        return Promise.resolve();

      } else {

        // tslint:disable-next-line:max-line-length
        LOG.error(`Smart contract cannot be de-registered. Result code ${result.ok} and error ${JSON.stringify(result.lastErrorObject)}`);
        return Promise.reject(EthereumSmartContractInternalServerErrorResponse);

      }

    })
    .catch((error: string) => {

      LOG.error(`Smart contract cannot be de-registered: ${error}`);
      return Promise.reject(EthereumSmartContractInternalServerErrorResponse);

    });
}
