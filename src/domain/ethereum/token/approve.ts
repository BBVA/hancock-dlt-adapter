import * as db from '../../../db/ethereum';
import { hancockDbError } from '../../../models/error';
import {
  IEthereumContractAbiDbModel,
  IEthereumSmartContractInvokeByQueryRequest,
  IEthereumSmartContractInvokeModel,
  IEthereumTokenApproveTransferByQueryRequest,
  IEthereumTokenApproveTransferRequest,
} from '../../../models/ethereum';
import { error } from '../../../utils/error';
import logger from '../../../utils/logger';
import { hancockContractNotFoundError } from '../models/error';
import { adaptContractInvoke } from '../smartContract/common';
import { invokeByQuery } from '../smartContract/invoke';
import { hancockContractTokenApproveError } from './models/error';

export async function tokenApproveTransfer(transferRequest: IEthereumTokenApproveTransferRequest): Promise<any> {

  logger.info(`Token approve transfer`);

  let abi: IEthereumContractAbiDbModel | null;
  let invokeModel: IEthereumSmartContractInvokeModel;

  try {

    abi = await db.getAbiByName('erc20');

  } catch (err) {

    logger.error(err);
    throw error(hancockDbError, err);

  }

  if (abi) {

    invokeModel = {
      abi: abi.abi,
      action: 'send',
      from: transferRequest.from,
      method: 'approve',
      params: [transferRequest.spender, transferRequest.value],
      to: transferRequest.smartContractAddress,
    };

  } else {

    logger.info('Contract not found');
    throw error(hancockContractNotFoundError);

  }

  try {

    return await adaptContractInvoke(invokeModel);

  } catch (err) {

    logger.error(err);
    throw error(hancockContractTokenApproveError, err);

  }
}

export async function tokenApproveTransferByQuery(query: string, transferRequest: IEthereumTokenApproveTransferByQueryRequest): Promise<any> {

  logger.info(`Token approve transfer by query`);

  try {

    const invokeModel: IEthereumSmartContractInvokeByQueryRequest = {
      action: 'send',
      from: transferRequest.from,
      method: 'approve',
      params: [transferRequest.spender, transferRequest.value],
    };

    return await invokeByQuery(query, invokeModel);

  } catch (err) {

    logger.error(err);
    throw error(hancockContractTokenApproveError, err);

  }
}
