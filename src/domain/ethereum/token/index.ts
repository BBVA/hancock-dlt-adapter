import * as db from '../../../db/ethereum';
import { ethereumSmartContractNotFoundResponse, IEthereumContractDbModel, IEthereumSmartContractInvokeByQueryRequest } from '../../../models/ethereum';
import { IEthereumTokenBalanceResponse } from '../../../models/ethereum/token';
import { invokeByQuery } from '../smartContract/invoke';

export * from './register';
export * from './transfer';
export * from './approve';
export * from './transferFrom';
export * from './metadata';
export * from './allowance';

export async function getTokenBalance(addressOrAlias: string, address: string): Promise<IEthereumTokenBalanceResponse> {

  LOG.info(`Token balance`);

  try {

    const abi: IEthereumContractDbModel | null = await db.getSmartContractByAddressOrAlias(addressOrAlias);

    if (abi) {

      const invokeModel: IEthereumSmartContractInvokeByQueryRequest = {
        action: 'call',
        from: abi.address,
        method: 'balanceOf',
        params: [address],
      };

      const balanced = await invokeByQuery(addressOrAlias, invokeModel);

      const invokeModelb: IEthereumSmartContractInvokeByQueryRequest = {
        action: 'call',
        from: abi.address,
        method: 'decimals',
        params: [],
      };

      const decimal = await invokeByQuery(addressOrAlias, invokeModelb);

      const object = {
        accuracy: decimal,
        balance: balanced,
      };

      return object;

    } else {

      LOG.info('Contract not found');
      throw ethereumSmartContractNotFoundResponse;

    }

  } catch (e) {

    LOG.error(e);
    throw e;

  }
}
