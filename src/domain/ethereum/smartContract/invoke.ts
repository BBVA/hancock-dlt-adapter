import { IEthereumSmartContractInvokeModel } from '../../../models/ethereum';
import {
  IEthereumContractDbModel,
  IEthereumSmartContractInvokeAbiRequest,
  IEthereumSmartContractInvokeByQueryRequest,
  IEthereumSmartContractInvokeRequest,
} from '../../../models/ethereum';
import { ContractAbi } from '../../../models/ethereum';
import { error } from '../../../utils/error';
import logger from '../../../utils/logger';
import { adaptContractInvoke, retrieveContractAbi, retrieveContractAbiByAddressOrAlias } from './common';
import { hancockContractInvokeError } from './models/error';

export async function invoke(invokeRequest: IEthereumSmartContractInvokeRequest): Promise<any> {

  logger.debug('contract invoke ');

  try {

    const abi: ContractAbi = await retrieveContractAbi(invokeRequest.urlBase);

    const invokeModel: IEthereumSmartContractInvokeModel = {
      ...invokeRequest,
      abi,
    } as IEthereumSmartContractInvokeModel;

    return await adaptContractInvoke(invokeModel);

  } catch (err) {

    throw error(hancockContractInvokeError, err);

  }
}

export async function invokeAbi(invokeRequest: IEthereumSmartContractInvokeAbiRequest): Promise<any> {

  logger.debug('contract invoke abi');

  try {
    const abi: any[] = invokeRequest.abi as any;

    const invokeModel: IEthereumSmartContractInvokeModel = {
      action: invokeRequest.action,
      from: invokeRequest.from,
      method: invokeRequest.method,
      params: invokeRequest.params,
      abi,
      to: invokeRequest.to,
    } as IEthereumSmartContractInvokeModel;

    return await adaptContractInvoke(invokeModel);

  } catch (err) {

    throw error(hancockContractInvokeError, err);

  }
}

export async function invokeByQuery(addressOrAlias: string, invokeRequest: IEthereumSmartContractInvokeByQueryRequest): Promise<any> {

  logger.info(`Contract invoke by query: ${addressOrAlias}`);

  try {

    const contractModel: IEthereumContractDbModel = await retrieveContractAbiByAddressOrAlias(addressOrAlias);

    const invokeModel: IEthereumSmartContractInvokeModel = {
      ...invokeRequest,
      abi: contractModel.abi,
      to: contractModel.address,
    } as IEthereumSmartContractInvokeModel;

    return await adaptContractInvoke(invokeModel);

  } catch (err) {

    throw error(hancockContractInvokeError, err);

  }
}
