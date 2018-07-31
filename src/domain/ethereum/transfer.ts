import { error } from '../../controllers/error';
import { IEthereumTransferSendRequest } from '../../models/ethereum';
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

    logger.error(err);
    throw error(hancockEthereumTrasnferError, err);

  }

  // return new Promise<any>((resolve, reject) => {

  //   logger.info(`Sending Transfer`, transfer);

  //   ETH.web3.eth.sendTransaction(transfer, (err: any, result: any) => err
  //     ? reject(err)
  //     : resolve(result));

  // });
}
