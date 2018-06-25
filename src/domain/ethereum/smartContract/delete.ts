import { FindAndModifyWriteOpResultObject } from 'mongodb';
import * as db from '../../../db/ethereum';
import { EthereumSmartContractInternalServerErrorResponse } from '../../../models/ethereum/smartContract';

export async function deleteByQuery(addressOrAlias: string): Promise<void> {

  LOG.info(`De-registering contract by query: ${addressOrAlias}`);

  try {

    const result: FindAndModifyWriteOpResultObject = await db.deleteSmartContractByAddressOrAlias(addressOrAlias);

    if (result.ok === 1) {

      LOG.info(`Smart contract de-registered`);
      return Promise.resolve();

    } else {

      LOG.error(`Smart contract cannot be de-registered. Result code ${result.ok} and error ${JSON.stringify(result.lastErrorObject)}`);
      return Promise.reject(EthereumSmartContractInternalServerErrorResponse);

    }

  } catch (e) {

    LOG.error(`Smart contract cannot be de-registered: ${e}`);
    return Promise.reject(EthereumSmartContractInternalServerErrorResponse);

  }
}
