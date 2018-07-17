import responses from '../../utils/responses';
import { ContractAbi, ContractBin } from './';

// REQUESTS

export type IEthereumSmartContractRequestAction = 'call' | 'send';

export const SC_REQUEST_ACTIONS: {[k: string]: IEthereumSmartContractRequestAction} = {
  CALL: 'call',
  SEND: 'send',
};

export const SC_DEFAULT_ACTION: IEthereumSmartContractRequestAction = SC_REQUEST_ACTIONS.SEND;

export interface IEthereumSmartContractInvokeByQueryRequest {
  method: string;
  from: string;
  action?: IEthereumSmartContractRequestAction;
  params?: string[];
}

export interface IEthereumSmartContractInvokeRequest extends IEthereumSmartContractInvokeByQueryRequest {
  urlBase: string;
  to: string;
}

export interface IEthereumSmartContractInvokeModel extends IEthereumSmartContractInvokeByQueryRequest {
  to: string;
  abi: ContractAbi;
}

export interface IEthereumSmartContractDeployRequest {
  method: string;
  params?: string[];
  from: string;
  urlBase: string;
}

export interface IEthereumSmartContractDeployModel {
  params?: string[];
  from: string;
  abi: ContractAbi;
  bin: ContractBin;
}

export interface IEthereumSmartContractRegisterRequest {
  address: string;
  alias: string;
  abi: string;
}

// RESPONSES

export interface IEthereumSmartContractResponse {
  code: string;
  message: string;
  statusCode: number;
}

export interface IEthereumSmartContractRawTxResponse {
  from: string;
  to: string;
  value: number;
  gas: string;
  gasPrice: string;
  data: string;
}

export const EthereumSmartContractSuccessResponse: IEthereumSmartContractResponse = {
  code: responses.ndbgeneral200.code,
  message: 'Smart Contract - Success',
  statusCode: 200,
};

export const EthereumSmartContractRegisterSmartcontractSuccessResponse: IEthereumSmartContractResponse = {
  code: responses.ndbsmartcontract409.code,
  message: 'Smart Contract - Alias in use',
  statusCode: 200,
};

export const EthereumSmartContractCreatedResponse: IEthereumSmartContractResponse = {
  code: responses.ndbgeneral201.code,
  message: 'Smart Contract - Created',
  statusCode: 201,
};

export const EthereumSmartContractTransactionOkResponse: IEthereumSmartContractResponse = {
  code: responses.ndbsmartcontract202.code,
  message: 'Smart Contract - Transaction OK',
  statusCode: 202,
};

export const EthereumSmartContractSmartcontractAcceptedResponse: IEthereumSmartContractResponse = {
  code: responses.ndbsmartcontract202.code,
  message: 'Smart Contracts - Operation successfully requested. Consensus pending',
  statusCode: 202,
};

export const EthereumSmartContractNoContentResponse: IEthereumSmartContractResponse = {
  code: responses.ndbgeneral204.code,
  message: responses.ndbgeneral204.description,
  statusCode: 204,
};

export const EthereumSmartContractBadRequestResponse: IEthereumSmartContractResponse = {
  code: responses.ndbgeneral400.code,
  message: 'Smart Contract - Bad request',
  statusCode: 400,
};

export const EthereumSmartContractNotFoundResponse: IEthereumSmartContractResponse = {
  code: responses.ndbgeneral404.code,
  message: 'Smart Contract - Not Found',
  statusCode: 404,
};

export const EthereumSmartContractSourcecodeNotFoundErrorResponse: IEthereumSmartContractResponse = {
  code: responses.ndbgeneral404.code,
  message: 'Smart Contracts - Source code not found',
  statusCode: 404,
};

export const EthereumSmartContractAbiNameNotFoundResponse: IEthereumSmartContractResponse = {
  code: responses.ndbgeneral404.code,
  message: 'Smart Contract - Abi name not found',
  statusCode: 404,
};

export const EthereumSmartContractConflictResponse: IEthereumSmartContractResponse = {
  code: responses.ndbsmartcontract409.code,
  message: 'Smart Contract - Alias or address in use',
  statusCode: 409,
};

export const EthereumSmartContractInternalServerErrorResponse: IEthereumSmartContractResponse = {
  code: responses.ndbgeneral500.code,
  message: 'Smart Contract - Internal Server Error',
  statusCode: 500,
};

export const EthereumSmartContractSmartcontractErrorResponse: IEthereumSmartContractResponse = {
  code: responses.ndbsmartcontract500.code,
  message: 'Smart Contract - Blockchain request error',
  statusCode: 500,
};

export const EthereumSmartContractCompilationErrorResponse: IEthereumSmartContractResponse = {
  code: responses.ndbsmartcontract500.code,
  message: 'Smart Contract - Compilation error',
  statusCode: 500,
};

export const EthereumSmartContractDeployErrorResponse: IEthereumSmartContractResponse = {
  code: responses.ndbsmartcontract500.code,
  message: 'Smart Contract - Deployment error',
  statusCode: 500,
};

export const EthereumSmartContractTransactionErrorResponse: IEthereumSmartContractResponse = {
  code: responses.ndbsmartcontract500.code,
  message: 'Smart Contract - Transaction Error',
  statusCode: 500,
};

export const EthereumSmartContractInvalidTransactionInvokationResponse: IEthereumSmartContractResponse = {
  code: responses.ndbsmartcontract500.code,
  message: 'Smart Contract - Invalid transaction invokation',
  statusCode: 500,
};

// DDBB

export interface IEthereumContractInstanceDbModel {
  _id?: any;
  alias: string;
  address: string;
  abiName: string;
}

export interface IEthereumContractAbiDbModel {
  _id?: any;
  name: string;
  abi: any[];
}

export interface IEthereumContractDbModel {
  alias: string;
  address: string;
  abiName: string;
  abi: any[];
}
