import { IEthereumContractDbModel, IEthereumERC20TransferRequest, IEthereumSmartContractInvokeModel } from '../../../models/ethereum';
import { adaptContractInvoke, retrieveContractAbiByAddressOrAlias  } from '../smartContract/common';

export async function tokenTransfer(transferRequest: IEthereumERC20TransferRequest): Promise<any> {

  LOG.info(`Token transfer`);

  try {

    const abi: any[] = await retrieveAbibyName(transferRequest.smarcContractAddress);

    const invokeModel: IEthereumSmartContractInvokeModel = {
      abi,
      action: 'send',
      from: transferRequest.from,
      method: 'transfer',
      params: [transferRequest.to, transferRequest.value],
      to: transferRequest.smarcContractAddress,
    } as IEthereumSmartContractInvokeModel;

    return await adaptContractInvoke(invokeModel);

  } catch (e) {

    LOG.error(e);
    throw e;

  }
}
