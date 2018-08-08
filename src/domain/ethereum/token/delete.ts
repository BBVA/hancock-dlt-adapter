import * as db from '../../../db/ethereum';
import * as scDomainDelete from '../../../domain/ethereum/smartContract/delete';
import { hancockDbError } from '../../../models/error';
import { IEthereumContractDbModel } from '../../../models/ethereum';
import { TokenNames } from '../../../models/ethereum/token';
import { error } from '../../../utils/error';
import logger from '../../../utils/logger';
import { hancockContractNotFoundError } from '../models/error';
import { hancockContractTokenDeleteError } from './models/error';

export async function tokenDeleteByQuery(addressOrAlias: string): Promise<void> {

  logger.info(`De-registering token contract by query: ${addressOrAlias}`);

  let contractDbModel: IEthereumContractDbModel | null;

  try {

    contractDbModel = await db.getSmartContractByAddressOrAlias(addressOrAlias);

  } catch (e) {

    throw error(hancockDbError, e);

  }

  if (contractDbModel && contractDbModel.abiName === TokenNames.ERC20) {

    try {

      await scDomainDelete.deleteByQuery(addressOrAlias, false);

    } catch (e) {

      throw error(hancockContractTokenDeleteError, e);

    }

  } else {

    throw error(hancockContractNotFoundError);

  }

}
