import * as db from '../../../db/ethereum';
import {
  ethereumSmartContractNotFoundResponse,
  IEthereumContractAbiDbModel,
  IEthereumSmartContractInvokeByQueryRequest,
  IEthereumSmartContractInvokeModel,
  IEthereumTokenAllowanceByQueryRequest,
  IEthereumTokenAllowanceRequest,
} from '../../../models/ethereum';
import * as logger from '../../../utils/logger';
import { adaptContractInvoke  } from '../smartContract/common';
import { invokeByQuery } from '../smartContract/invoke';

const LOG = logger.getLogger();

export async function tokenAllowance(allowanceRequest: IEthereumTokenAllowanceRequest): Promise<any> {

  LOG.info(`Token allowance`);

  try {

    const abi: IEthereumContractAbiDbModel | null = await db.getAbiByName('erc20');

    if (abi) {

      const invokeModel: IEthereumSmartContractInvokeModel = {
        abi: abi.abi,
        action: 'send',
        from: allowanceRequest.from,
        method: 'allowance',
        params: [allowanceRequest.tokenOwner, allowanceRequest.spender],
        to: allowanceRequest.smartContractAddress,
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

export async function tokenAllowanceByQuery(query: string, allowanceRequest: IEthereumTokenAllowanceByQueryRequest): Promise<any> {

  LOG.info(`Token allowance by query`);

  try {

    const invokeModel: IEthereumSmartContractInvokeByQueryRequest = {
      action: 'send',
      from: allowanceRequest.from,
      method: 'allowance',
      params: [allowanceRequest.tokenOwner, allowanceRequest.spender],
    };

    return await invokeByQuery(query, invokeModel);

  } catch (e) {

    LOG.error(e);
    throw e;

  }
}
