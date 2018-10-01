import { getBitcoinClient } from '../../utils/bitcoin';
import { error } from '../../utils/error';
import { hancockBitcoinBalanceError } from './models/error';

export async function getBalance(address: string): Promise<string> {

  try {

    return (await getBitcoinClient()).api.getBalance(address);

  } catch (err) {

    throw error(hancockBitcoinBalanceError, err);

  }

}
