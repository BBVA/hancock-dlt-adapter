import responses from '../../utils/responses';
import { address } from '../common';

export enum TokenNames {
  ERC20 = 'erc20',
}

export interface IEthereumTokenTransferRequest {
  from: address;
  to: address;
  value: string;
  smartContractAddress: string;
}

export interface IEthereumTokenTransferByQueryRequest {
  from: address;
  to: address;
  value: string;
}

export interface IEthereumTokenApproveTransferRequest {
  from: address;
  spender: string;
  value: string;
  smartContractAddress: string;
}

export interface IEthereumTokenApproveTransferByQueryRequest {
  from: address;
  spender: string;
  value: string;
}

export interface IEthereumTokenTransferFromRequest extends IEthereumTokenTransferRequest {
  sender: string;
}

export interface IEthereumTokenTransferFromByQueryRequest extends IEthereumTokenTransferByQueryRequest {
  sender: string;
}

export interface IEthereumTokenRegisterRequest {
  address: string;
  alias: string;
}

export interface IEthereumTokenResponse {
  code: string;
  message: string;
  statusCode: number;
}

export interface IEthereumTokenBalanceResponse {
  balance: string;
  accuracy: string;
}

export interface IEthereumTokenMetadataResponse {
  name: string;
  symbol: string;
  decimals: string;
  totalSupply: string;
}

export interface IEthereumTokenAllowanceRequest {
  from: address;
  tokenOwner: string;
  spender: string;
  smartContractAddress: string;
}

export interface IEthereumTokenAllowanceByQueryRequest {
  from: address;
  tokenOwner: string;
  spender: string;
}

export const ethereumBadRequestTokenResponse: IEthereumTokenResponse = {
  code: responses.ndbgeneral400.code,
  message: 'Token ERC20 - Bad request',
  statusCode: 400,
};

export const ethereumErrorTokenResponse: IEthereumTokenResponse = {
  code: responses.ndbsmartcontract500.code,
  message: 'Token ERC20 - Blockchain request error',
  statusCode: 500,
};

export const ethereumOkTokenResponse: IEthereumTokenResponse = {
  code: responses.ndbsmartcontract202.code,
  message: 'Token ERC20 - Operation successfully requested',
  statusCode: 202,
};

export const ethereumTokenRegisterSuccessResponse: IEthereumTokenResponse = {
  code: responses.ndbgeneral200.code,
  message: 'Token Register - Success',
  statusCode: 200,
};

export const ethereumTokenMetadataSuccessResponse: IEthereumTokenResponse = {
  code: responses.ndbgeneral200.code,
  message: 'Token Metadata - Success',
  statusCode: 200,
};

export const ethereumTokenFindAllSuccessResponse: IEthereumTokenResponse = {
  code: responses.ndbgeneral200.code,
  message: 'Token Find All - Success',
  statusCode: 200,
};

export const ethereumTokenTransferSuccessResponse: IEthereumTokenResponse = {
  code: responses.ndbgeneral200.code,
  message: 'Token Transfer - Success',
  statusCode: 200,
};

export const ethereumTokenApproveTransferSuccessResponse: IEthereumTokenResponse = {
  code: responses.ndbgeneral200.code,
  message: 'Token Approve Transfer - Success',
  statusCode: 200,
};

export const ethereumTokenAllowanceSuccessResponse: IEthereumTokenResponse = {
  code: responses.ndbgeneral200.code,
  message: 'Token Allowance - Success',
  statusCode: 200,
};

export const ethereumTokenTransferBadRequestResponse: IEthereumTokenResponse = {
  code: responses.ndbgeneral400.code,
  message: 'Token Transfer - Bad request',
  statusCode: 400,
};

export const ethereumTokenTransferNotFoundResponse: IEthereumTokenResponse = {
  code: responses.ndbgeneral404.code,
  message: 'Token Transfer - Not Found',
  statusCode: 404,
};

export const ethereumTokenTransferInternalServerErrorResponse: IEthereumTokenResponse = {
  code: responses.ndbgeneral500.code,
  message: 'Token Transfer - Internal Server Error',
  statusCode: 500,
};

export const ethereumTokenTransferFromSuccessResponse: IEthereumTokenResponse = {
  code: responses.ndbgeneral200.code,
  message: 'Token TransferFrom - Success',
  statusCode: 200,
};
