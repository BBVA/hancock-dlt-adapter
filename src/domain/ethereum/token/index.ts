import * as db from '../../../db/ethereum';
import { EthereumSmartContractNotFoundResponse, IEthereumContractDbModel } from '../../../models/ethereum';

export * from './register';
export * from './transfer';

export async function getTokenBalance(address: string, addressOrAlias: string): Promise<number> {

  LOG.info(`Token balance`);

  try {

    const abi: IEthereumContractDbModel | null = await db.getSmartContractByAddressOrAlias(addressOrAlias);

    if (abi) {

      return new Promise<number>((resolve, reject) => {
        ETH.web3.eth.contract(abi.abi, abi.address).balanceOf(address, (err: any, result: number) => err ? reject(err) : resolve(result));
      });
    } else {

      LOG.info('Contract not found');
      throw EthereumSmartContractNotFoundResponse;

    }

  } catch (e) {

    LOG.error(e);
    throw e;

  }
}