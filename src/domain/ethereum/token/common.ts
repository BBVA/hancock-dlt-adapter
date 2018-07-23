import {
  IEthereumSmartContractInvokeByQueryRequest,
  IEthereumSmartContractInvokeModel,
  IEthereumSmartContractRequestAction,
 } from '../../../models/ethereum';

export function getRequestModel(
  action: IEthereumSmartContractRequestAction,
  from: string,
  method: string,
  params: any[],
): IEthereumSmartContractInvokeByQueryRequest {

  const invokeModel: IEthereumSmartContractInvokeByQueryRequest = {
    action,
    from,
    method,
    params,
  };
  return invokeModel;

}

export function getAdaptRequestModel(
  abi: any[],
  action: IEthereumSmartContractRequestAction,
  method: string,
  params: any[],
  address: string,
): IEthereumSmartContractInvokeModel {

  const invokeModel: IEthereumSmartContractInvokeModel = {
    abi,
    action,
    from: '',
    method,
    params,
    to: address,
  };

  return invokeModel;
}
