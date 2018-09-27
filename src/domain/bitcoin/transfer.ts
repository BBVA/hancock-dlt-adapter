import { IEthereumTransferSendRequest } from '../../models/ethereum';
import { error } from '../../utils/error';
import logger from '../../utils/logger';
import * as utils from '../../utils/utils';
import { hancockBitcoinTransferError } from './models/error';

export async function sendTransfer(transfer: IEthereumTransferSendRequest): Promise<any> {

  try {

    if (transfer.data) {
      transfer.data = utils.strToHex(transfer.data);
    }

    return new Promise<any>((resolve, reject) => {

      logger.info(`Sending Transfer`, transfer);

      ETH.web3.eth.sendTransaction(transfer, (err: any, result: any) => err
        ? reject(err)
        : resolve(result));

    });

  } catch (err) {

    throw error(hancockBitcoinTransferError, err);

  }
}
