import { TokenNames } from '../../../models/ethereum';
import { registerInstance } from '../smartContract/register';

export async function tokenRegister(alias: string, address: string): Promise<any> {

  LOG.info(`Token register`);

  try {

    return await registerInstance(alias, address, TokenNames.ERC20);

  } catch (e) {

    LOG.error(e);
    throw e;

  }
}
