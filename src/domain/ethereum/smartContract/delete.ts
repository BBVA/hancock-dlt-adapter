import { FindAndModifyWriteOpResultObject } from 'mongodb';
import * as db from '../../../db/ethereum';
import { EthereumSmartContractInternalServerErrorResponse, IEthereumContractDbModel } from '../../../models/ethereum/smartContract';

export async function deleteByQuery(addressOrAlias: string): Promise<void> {

  LOG.info(`De-registering contract by query: ${addressOrAlias}`);

  try {

    const contractModel: IEthereumContractDbModel | null = await db.getSmartContractByAddressOrAlias(addressOrAlias);

    if (!contractModel) {
      throw new Error('Contract doesnt exists');
    }

    const resultInstance: FindAndModifyWriteOpResultObject = await db.deleteSmartContractByAddressOrAlias(addressOrAlias);
    const resultAbi: FindAndModifyWriteOpResultObject = await db.deleteSmartContracAbiByName(contractModel.abiName);

    if (resultInstance.ok === 1 && resultAbi.ok === 1) {

      LOG.info(`Smart contract de-registered`);
      return Promise.resolve();

    } else {

      LOG.error(`Smart contract cannot be de-registered. Result code ${resultInstance.ok} and error ${JSON.stringify(resultInstance.lastErrorObject)}`);
      return Promise.reject(EthereumSmartContractInternalServerErrorResponse);

    }

  } catch (e) {

    LOG.error(`Smart contract cannot be de-registered: ${e}`);
    return Promise.reject(EthereumSmartContractInternalServerErrorResponse);

  }
}
