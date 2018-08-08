import * as db from '../../../db/ethereum';
import { hancockDbError } from '../../../models/error';
import {
  IEthereumContractAbiDbModel,
  IEthereumSmartContractInvokeByQueryRequest,
  IEthereumSmartContractInvokeModel,
  IEthereumTokenApproveTransferByQueryRequest,
  IEthereumTokenApproveTransferRequest,
  TokenNames,
} from '../../../models/ethereum';
import { error } from '../../../utils/error';
import logger from '../../../utils/logger';
import { adaptContractInvoke } from '../smartContract/common';
import { invokeByQuery } from '../smartContract/invoke';
import { hancockContractAbiError, hancockContractInvokeError } from '../smartContract/models/error';

export async function tokenApproveTransfer(transferRequest: IEthereumTokenApproveTransferRequest): Promise<any> {

  logger.info(`Token approve transfer`);

  let abi: IEthereumContractAbiDbModel | null;

  try {

    abi = await db.getAbiByName(TokenNames.ERC20);

  } catch (err) {

    throw error(hancockDbError, err);

  }

  if (abi) {

    const invokeModel: IEthereumSmartContractInvokeModel = {
      abi: abi.abi,
      action: 'send',
      from: transferRequest.from,
      method: 'approve',
      params: [transferRequest.spender, transferRequest.value],
      to: transferRequest.smartContractAddress,
    };

    try {

      return await adaptContractInvoke(invokeModel);

    } catch (err) {

      throw error(hancockContractInvokeError, err);

    }

  } else {

    throw error(hancockContractAbiError);

  }
}

export async function tokenApproveTransferByQuery(addressOrAlias: string, transferRequest: IEthereumTokenApproveTransferByQueryRequest): Promise<any> {

  logger.info(`Token approve transfer by query`);

  try {

    const invokeModel: IEthereumSmartContractInvokeByQueryRequest = {
      action: 'send',
      from: transferRequest.from,
      method: 'approve',
      params: [transferRequest.spender, transferRequest.value],
    };

    return await invokeByQuery(addressOrAlias, invokeModel);

  } catch (err) {

    throw error(hancockContractInvokeError, err);

  }
}
