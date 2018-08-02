import { error } from '../../utils/error';
import { hancockEthereumBalanceError } from './models/error';

export async function getBalance(address: string): Promise<number> {

  try {

    return await ETH.web3.eth.getBalance(address);

  } catch (err) {

    throw error(hancockEthereumBalanceError, err);

  }

}

export * from './transfer';
export * from './smartContract';
export * from './token';
