import * as db from '../../../db/ethereum';
import {
  ethereumSmartContractNotFoundResponse,
  IEthereumContractAbiDbModel,
  IEthereumSmartContractInvokeByQueryRequest,
  IEthereumSmartContractInvokeModel,
  IEthereumTokenTransferFromByQueryRequest,
  IEthereumTokenTransferFromRequest,
} from '../../../models/ethereum';
import { adaptContractInvoke  } from '../smartContract/common';
import { invokeByQuery } from '../smartContract/invoke';

export async function tokenTransferFrom(transferRequest: IEthereumTokenTransferFromRequest): Promise<any> {

  LOG.info(`Token transfer from`);

  try {

    const abi: IEthereumContractAbiDbModel | null = await db.getAbiByName('erc20');

    if (abi) {

      const invokeModel: IEthereumSmartContractInvokeModel = {
        abi: abi.abi,
        action: 'send',
        from: transferRequest.from,
        method: 'transferFrom',
        params: [transferRequest.sender, transferRequest.to, transferRequest.value],
        to: transferRequest.smartContractAddress,
      };

      return await adaptContractInvoke(invokeModel);

    } else {

      LOG.info('Contract not found');
      throw ethereumSmartContractNotFoundResponse;

    }

  } catch (e) {

    LOG.error(e);
    throw e;

  }
}

export async function tokenTransferFromByQuery(query: string, transferRequest: IEthereumTokenTransferFromByQueryRequest): Promise<any> {

  LOG.info(`Token transfer from by query`);

  try {

    const invokeModel: IEthereumSmartContractInvokeByQueryRequest = {
      action: 'send',
      from: transferRequest.from,
      method: 'transferFrom',
      params: [transferRequest.sender, transferRequest.to, transferRequest.value],
    };

    return await invokeByQuery(query, invokeModel);

  } catch (e) {

    LOG.error(e);
    throw e;

  }
}
