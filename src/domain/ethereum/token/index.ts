import * as db from '../../../db/ethereum';
import { hancockDbError } from '../../../models/error';
import { IEthereumContractDbModel, IEthereumSmartContractInvokeByQueryRequest } from '../../../models/ethereum';
import { IEthereumTokenBalanceResponse } from '../../../models/ethereum/token';
import { error } from '../../../utils/error';
import logger from '../../../utils/logger';
import { hancockContractNotFoundError } from '../models/error';
import { invokeByQuery } from '../smartContract/invoke';
import { hancockContractTokenBalanceError } from './models/error';

export * from './register';
export * from './transfer';
export * from './approve';
export * from './transferFrom';
export * from './metadata';
export * from './allowance';

export async function getTokenBalance(addressOrAlias: string, address: string): Promise<IEthereumTokenBalanceResponse> {

  logger.info(`Token balance`);

  let balanced;
  let decimal;
  let abi: IEthereumContractDbModel | null;
  let invokeModel: IEthereumSmartContractInvokeByQueryRequest;

  try {

    abi = await db.getSmartContractByAddressOrAlias(addressOrAlias);

  } catch (err) {

    logger.error(err);
    throw error(hancockDbError, err);

  }

  if (abi) {

    invokeModel = {
      action: 'call',
      from: abi.address,
      method: 'balanceOf',
      params: [address],
    };

  } else {

    logger.info('Contract not found');
    throw error(hancockContractNotFoundError);

  }

  try {

    balanced = await invokeByQuery(addressOrAlias, invokeModel);

    const invokeModelb: IEthereumSmartContractInvokeByQueryRequest = {
      action: 'call',
      from: abi.address,
      method: 'decimals',
      params: [],
    };

    decimal = await invokeByQuery(addressOrAlias, invokeModelb);

  } catch (err) {

    logger.error(err);
    throw error(hancockContractTokenBalanceError, err);

  }

  const object = {
    accuracy: decimal,
    balance: balanced,
  };

  return object;

}
