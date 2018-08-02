import { FindAndModifyWriteOpResultObject } from 'mongodb';
import * as db from '../../../db/ethereum';
import { hancockDbError } from '../../../models/error';
import { IEthereumContractDbModel } from '../../../models/ethereum/smartContract';
import { error } from '../../../utils/error';
import logger from '../../../utils/logger';
import { hancockContractNotFoundError } from '../models/error';
import { hancockContractDeleteError } from './models/error';

export async function deleteByQuery(addressOrAlias: string): Promise<void> {

  logger.info(`De-registering contract by query: ${addressOrAlias}`);
  let contractModel: IEthereumContractDbModel | null;
  try {

    contractModel = await db.getSmartContractByAddressOrAlias(addressOrAlias);

  } catch (e) {

    throw error(hancockDbError, e);

  }

  if (!contractModel) {
    throw error(hancockContractNotFoundError);
  }

  let resultInstance: FindAndModifyWriteOpResultObject;
  let resultAbi: FindAndModifyWriteOpResultObject;

  try {

    resultInstance = await db.deleteSmartContractByAddressOrAlias(addressOrAlias);
    resultAbi = await db.deleteSmartContracAbiByName(contractModel.abiName);

  } catch (err) {

    throw error(hancockDbError, err);

  }

  if (resultInstance.ok === 1 && resultAbi.ok === 1) {

    logger.info(`Smart contract de-registered`);
    return Promise.resolve();

  } else {

    throw error(hancockContractDeleteError);

  }
}
