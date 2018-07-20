import {
  IEthereumSmartContractInvokeByQueryRequest,
  IEthereumSmartContractRequestAction,
 } from '../../../models/ethereum';

export function getRequestModel(
  action: IEthereumSmartContractRequestAction,
  from: string,
  method: string,
  params: any[]): IEthereumSmartContractInvokeByQueryRequest {

  const invokeModel: IEthereumSmartContractInvokeByQueryRequest = {
    action,
    from,
    method,
    params,
  };
  return invokeModel;

}
