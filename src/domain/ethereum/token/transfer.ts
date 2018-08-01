import * as db from '../../../db/ethereum';
import {
  IEthereumContractAbiDbModel,
  IEthereumSmartContractInvokeByQueryRequest,
  IEthereumSmartContractInvokeModel,
  IEthereumTokenTransferByQueryRequest,
  IEthereumTokenTransferRequest,
} from '../../../models/ethereum';
import { error } from '../../../utils/error';
import logger from '../../../utils/logger';
import { hancockContractNotFoundError } from '../models/error';
import { adaptContractInvoke  } from '../smartContract/common';
import { invokeByQuery } from '../smartContract/invoke';
import { hancockContractAbiError, hancockContractInvokeError } from '../smartContract/models/error';

export async function tokenTransfer(transferRequest: IEthereumTokenTransferRequest): Promise<any> {

  logger.info(`Token transfer`);
  let abi: IEthereumContractAbiDbModel | null;

  try {

    abi = await db.getAbiByName('erc20');

  } catch (err) {

    logger.error(err);
    throw error(hancockContractAbiError, err);

  }

  if (abi) {

    const invokeModel: IEthereumSmartContractInvokeModel = {
      abi: abi.abi,
      action: 'send',
      from: transferRequest.from,
      method: 'transfer',
      params: [transferRequest.to, transferRequest.value],
      to: transferRequest.smartContractAddress,
    };

    try {

      return await adaptContractInvoke(invokeModel);

    } catch (err) {

      logger.error(err);
      throw error(hancockContractInvokeError, err);

    }

  } else {

    logger.info('Contract not found');
    throw error(hancockContractNotFoundError);

  }
}

export async function tokenTransferByQuery(query: string, transferRequest: IEthereumTokenTransferByQueryRequest): Promise<any> {

  logger.info(`Token transfer by query`);

  try {

    const invokeModel: IEthereumSmartContractInvokeByQueryRequest = {
      action: 'send',
      from: transferRequest.from,
      method: 'transfer',
      params: [transferRequest.to, transferRequest.value],
    };

    return await invokeByQuery(query, invokeModel);

  } catch (err) {

    logger.error(err);
    throw error(hancockContractInvokeError, err);

  }
}
