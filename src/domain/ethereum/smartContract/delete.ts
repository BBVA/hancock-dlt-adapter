import { FindAndModifyWriteOpResultObject } from 'mongodb';
import * as db from '../../../db/ethereum';
import { hancockDbError } from '../../../models/error';
import { IEthereumContractDbModel } from '../../../models/ethereum/smartContract';
import { error } from '../../../utils/error';
import logger from '../../../utils/logger';
import { hancockContractNotFoundError } from '../models/error';
import { hancockContractDeleteError } from './models/error';

export async function deleteByQuery(addressOrAlias: string, deleteAbi: boolean = true): Promise<void> {

  logger.info(`De-registering contract by query: ${addressOrAlias}`);
  let contractDbModel: IEthereumContractDbModel | null;
  try {

    contractDbModel = await db.getSmartContractByAddressOrAlias(addressOrAlias);

  } catch (e) {

    throw error(hancockDbError, e);

  }

  if (!contractDbModel) {
    throw error(hancockContractNotFoundError);
  }

  let resultInstance: FindAndModifyWriteOpResultObject;
  let resultAbi: FindAndModifyWriteOpResultObject | undefined;

  try {

    resultInstance = await db.deleteSmartContractByAddressOrAlias(addressOrAlias);

    if (deleteAbi) {

      resultAbi = await db.deleteSmartContracAbiByName(contractDbModel.abiName);

    }

  } catch (err) {

    throw error(hancockDbError, err);

  }

  if (resultInstance.ok === 1 && (!resultAbi || resultAbi.ok === 1)) {

    logger.info(`Smart contract de-registered`);
    return Promise.resolve();

  } else {

    throw error(hancockContractDeleteError);

  }
}
