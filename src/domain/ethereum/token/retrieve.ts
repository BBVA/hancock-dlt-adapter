import * as db from '../../../db/ethereum';
import { hancockDbError } from '../../../models/error';
import { TokenNames } from '../../../models/ethereum';
import {
  IEthereumContractInstanceDbModel,
} from '../../../models/ethereum/smartContract';
import { error } from '../../../utils/error';
import logger from '../../../utils/logger';

export async function tokenFindAll(): Promise<IEthereumContractInstanceDbModel[]> {

  try {

    const contractDbModel: IEthereumContractInstanceDbModel[] = await db.getInstancesByAbi(TokenNames.ERC20);
    logger.info(`Listing all resources`);
    return contractDbModel;

  } catch (err) {

    throw error(hancockDbError, err);

  }

}
