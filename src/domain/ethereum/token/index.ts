import * as db from '../../../db/ethereum';
import { EthereumSmartContractNotFoundResponse, IEthereumContractDbModel, IEthereumSmartContractInvokeByQueryRequest } from '../../../models/ethereum';
import { IEthereumTokenBalanceResponse } from '../../../models/ethereum/token';
import { invokeByQuery } from '../smartContract/invoke';

export * from './register';
export * from './transfer';

export async function getTokenBalance(address: string, addressOrAlias: string): Promise<IEthereumTokenBalanceResponse> {

  LOG.info(`Token balance`);

  try {

    const abi: IEthereumContractDbModel | null = await db.getSmartContractByAddressOrAlias(addressOrAlias);

    if (abi) {

        //ETH.web3.eth.contract(abi.abi, abi.address).methods.balanceOf(address, (err: any, result: number) => err ? reject(err) : resolve(result));

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
            params: [address],
          };

          const decimal = await invokeByQuery(addressOrAlias, invokeModelb);

          const object = {
            accuracy: decimal,
            balance: balanced,
          };

          return object;

    } else {

      LOG.info('Contract not found');
      throw EthereumSmartContractNotFoundResponse;

    }

  } catch (e) {

    LOG.error(e);
    throw e;

  }
}