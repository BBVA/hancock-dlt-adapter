import { error } from '../../utils/error';
import { hancockEthereumBalanceError } from './models/error';

export async function getBalance(address: string): Promise<string> {

  try {

    return await ETH.web3.eth.getBalance(address);

  } catch (err) {

    throw error(hancockEthereumBalanceError, err);

  }

}
