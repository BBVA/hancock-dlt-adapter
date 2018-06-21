import { IEthereumSmartContractInvokeModel } from '../../../models/ethereum';
import {
  IEthereumContractDbModel,
  IEthereumSmartContractInvokeByQueryRequest,
  IEthereumSmartContractInvokeRequest,
} from '../../../models/ethereum/smartContract';
import { adaptContractInvoke, retrieveContractAbi, retrieveContractAbiByAddressOrAlias } from '../smartContract/common';
import { ContractAbi } from './../../../models/ethereum/common';

export async function invoke(invokeRequest: IEthereumSmartContractInvokeRequest): Promise<any> {

  LOG.debug('contract invoke ');

  try {

    const abi: ContractAbi = await retrieveContractAbi(invokeRequest.urlBase);

    const invokeModel: IEthereumSmartContractInvokeModel = {
      ...invokeRequest,
      abi,
    } as IEthereumSmartContractInvokeModel;

    return await adaptContractInvoke(invokeModel);

  } catch (e) {

    LOG.error(e);
    throw e;

  }
}

// tslint:disable-next-line:max-line-length
export async function invokeByQuery(addressOrAlias: string, invokeRequest: IEthereumSmartContractInvokeByQueryRequest): Promise<any> {

  LOG.info(`Contract invoke by query: ${addressOrAlias}`);

  try {

    const contractModel: IEthereumContractDbModel = await retrieveContractAbiByAddressOrAlias(addressOrAlias);

    const invokeModel: IEthereumSmartContractInvokeModel = {
      ...invokeRequest,
      abi: contractModel.abi,
      to: contractModel.address,
    } as IEthereumSmartContractInvokeModel;

    return await adaptContractInvoke(invokeModel);

  } catch (e) {

    LOG.error(e);
    throw e;

  }
}
