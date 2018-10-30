import { IBitcoinTransferSendRequest } from '../../models/bitcoin';
import { getBitcoinClient } from '../../utils/bitcoin/bitcoin';
import { error } from '../../utils/error';
import logger from '../../utils/logger';
import * as utils from '../../utils/utils';
import { hancockBitcoinTransferError } from './models/error';

export async function sendTransfer(transfer: IBitcoinTransferSendRequest): Promise<any> {

  try {

    logger.info(`Sending Transfer`, transfer);

    const client: any = await getBitcoinClient();

    const Transaction = client.lib.Transaction;
    const apiClient = client.api;

    const utxos: any = await apiClient.getUtxo(transfer.from);

    const transaction = new Transaction()
      .from(utxos)
      .to(transfer.to, parseInt(transfer.value, 10))
      .change(transfer.from);

    if (transfer.data) {
      transfer.data = utils.strToHex(transfer.data).substr(80);
      transaction.addData(transfer.data);
    }

    return transaction.serialize({
      disableIsFullySigned: true,
    });

  } catch (err) {

    throw error(hancockBitcoinTransferError, err);

  }
}
