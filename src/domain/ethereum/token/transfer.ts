import * as db from '../../../db/ethereum';
import { EthereumSmartContractNotFoundResponse, IEthereumContractDbModel,
  IEthereumERC20TransferRequest, IEthereumSmartContractInvokeModel } from '../../../models/ethereum';
import { adaptContractInvoke, retrieveContractAbiByAddressOrAlias  } from '../smartContract/common';

export async function tokenTransfer(transferRequest: IEthereumERC20TransferRequest): Promise<any> {

  LOG.info(`Token transfer`);

  try {

    const abi: IEthereumContractDbModel | null = await db.getAbiByName('erc20');

    if (abi) {

    const invokeModel: IEthereumSmartContractInvokeModel = {
      abi: abi.abi ,
      action: 'send',
      from: transferRequest.from,
      method: 'transfer',
      params: [transferRequest.to, transferRequest.value],
      to: transferRequest.smartContractAddress,
    };

    return await adaptContractInvoke(invokeModel);

    } else {

      LOG.info('Contract not found');
      throw EthereumSmartContractNotFoundResponse;

    }

  } catch (e) {

    LOG.error(e);
    throw e;

  }
}
