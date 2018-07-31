import { error } from '../../utils/error';
import { hancockEthereumBalanceError } from './models/error';

export async function getBalance(address: string): Promise<number> {

  try {

    return await ETH.web3.eth.getBalance(address);

  } catch (err) {

    throw error(hancockEthereumBalanceError, err);

  }

  // return new Promise<number>((resolve, reject) => {
  //   ETH.web3.eth.getBalance(address, (err: any, result: number) => err ? reject(err) : resolve(result));
  // });
}

export * from './transfer';
export * from './smartContract';
export * from './token';
