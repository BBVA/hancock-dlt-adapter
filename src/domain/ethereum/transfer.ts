import { IEthereumTransferSendRequest } from '../../models/ethereum';
import { error } from '../../utils/error';
import logger from '../../utils/logger';
import * as utils from '../../utils/utils';
import { hancockEthereumTrasnferError } from './models/error';

export async function sendTransfer(transfer: IEthereumTransferSendRequest): Promise<any> {

  try {

    if (transfer.data) {
      transfer.data = utils.strToHex(transfer.data);
    }
    logger.info(`Sending Transfer`, transfer);

    return await ETH.web3.eth.sendTransaction(transfer);

  } catch (err) {

    throw error(hancockEthereumTrasnferError, err);

  }
}
