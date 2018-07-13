import * as db from '../../../db/ethereum';
import { EthereumSmartContractNotFoundResponse, IEthereumContractDbModel,
  IEthereumERC20TransferRequest, IEthereumSmartContractInvokeModel } from '../../../models/ethereum';
import { adaptContractInvoke, retrieveContractAbiByAddressOrAlias  } from '../smartContract/common';


export * from './transfer';

export async function getTokenBalance(address: string, scaddress: string): Promise<number> {

  LOG.info(`Token balance`);

  try {

    const abi: IEthereumContractDbModel | null = await db.getAbiByName('erc20');

    if (abi) {

      return new Promise<number>((resolve, reject) => {
        ETH.web3.eth.contract(abi.abi).at(scaddress).balanceOf(address, (err: any, result: number) => err ? reject(err) : resolve(result));
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