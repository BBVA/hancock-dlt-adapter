import { TokenNames } from '../../../models/ethereum';
import * as logger from '../../../utils/logger';
import { registerInstance } from '../smartContract/register';

const LOG = logger.getLogger();

export async function tokenRegister(alias: string, address: string): Promise<any> {

  LOG.info(`Token register`);

  try {

    return await registerInstance(alias, address, TokenNames.ERC20);

  } catch (e) {

    LOG.error(e);
    throw e;

  }
}
