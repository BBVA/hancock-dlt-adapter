import { TokenNames } from '../../../models/ethereum';
import { error } from '../../../utils/error';
import logger from '../../../utils/logger';
import { registerInstance } from '../smartContract/register';
import { hancockContractTokenRegisterError } from './models/error';

export async function tokenRegister(alias: string, address: string): Promise<any> {

  logger.info(`Token register`);

  try {

    return await registerInstance(alias, address, TokenNames.ERC20);

  } catch (err) {

    throw error(hancockContractTokenRegisterError, err);

  }
}
