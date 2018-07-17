import * as db from '../../../db/ethereum';
import {
  EthereumSmartContractNotFoundResponse,
  IEthereumContractAbiDbModel,
  IEthereumSmartContractInvokeByQueryRequest,
  IEthereumSmartContractInvokeModel,
  IEthereumTokenTransferByQueryRequest,
  IEthereumTokenTransferRequest,
} from '../../../models/ethereum';
import { adaptContractInvoke, retrieveContractAbiByAddressOrAlias  } from '../smartContract/common';
import { invokeByQuery } from '../smartContract/invoke';

export async function tokenTransfer(transferRequest: IEthereumTokenTransferRequest): Promise<any> {

  LOG.info(`Token transfer`);

  try {

    const abi: IEthereumContractAbiDbModel | null = await db.getAbiByName('erc20');

    if (abi) {

    const invokeModel: IEthereumSmartContractInvokeModel = {
      abi: abi.abi ,
      action: 'send',
      from: transferRequest.from,
      method: 'transfer',
      params: [transferRequest.to, transferRequest.value],
      to: transferRequest.smartContractAddress,
    };

    return await adaptContractInvoke(invokeModel);

    } else {

      LOG.info('Contract not found');
      throw EthereumSmartContractNotFoundResponse;

    }

  } catch (e) {

    LOG.error(e);
    throw e;

  }
}

export async function tokenTransferByQuery(query: string, transferRequest: IEthereumTokenTransferByQueryRequest): Promise<any> {

  LOG.info(`Token transfer by query`);

  try {

    const invokeModel: IEthereumSmartContractInvokeByQueryRequest = {
      action: 'send',
      from: transferRequest.from,
      method: 'transfer',
      params: [transferRequest.to, transferRequest.value],
    };

    return await invokeByQuery(query, invokeModel);

  } catch (e) {

    LOG.error(e);
    throw e;

  }
}
