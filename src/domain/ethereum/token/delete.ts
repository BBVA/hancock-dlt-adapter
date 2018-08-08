import * as scDomainDelete from '../../../domain/ethereum/smartContract/delete';
import { error } from '../../../utils/error';
import logger from '../../../utils/logger';
import { hancockContractTokenDeleteError } from './models/error';

export async function tokenDeleteByQuery(addressOrAlias: string): Promise<void> {

  logger.info(`De-registering token contract by query: ${addressOrAlias}`);

  try {

    await scDomainDelete.deleteByQuery(addressOrAlias, false);

  } catch (e) {

    throw error(hancockContractTokenDeleteError, e);

  }

}
