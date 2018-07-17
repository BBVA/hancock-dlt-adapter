import responses from '../../utils/responses';

export enum TokenNames {
  ERC20 = 'erc20',
}

export interface IEthereumTokenTransferRequest {
  from: string;
  to: string;
  value: string;
  smartContractAddress: string;
}

export interface IEthereumTokenTransferByQueryRequest {
  from: string;
  to: string;
  value: string;
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

export const EthereumTokenRegisterSuccessResponse: IEthereumTokenResponse = {
  code: responses.ndbgeneral200.code,
  message: 'Token Register - Success',
  statusCode: 200,
};

export const EthereumTokenTransferSuccessResponse: IEthereumTokenResponse = {
  code: responses.ndbgeneral200.code,
  message: 'Token Transfer - Success',
  statusCode: 200,
};

export const EthereumTokenTransferBadRequestResponse: IEthereumTokenResponse = {
  code: responses.ndbgeneral400.code,
  message: 'Token Transfer - Bad request',
  statusCode: 400,
};

export const EthereumTokenTransferNotFoundResponse: IEthereumTokenResponse = {
  code: responses.ndbgeneral404.code,
  message: 'Token Transfer - Not Found',
  statusCode: 404,
};

export const EthereumTokenTransferInternalServerErrorResponse: IEthereumTokenResponse = {
  code: responses.ndbgeneral500.code,
  message: 'Token Transfer - Internal Server Error',
  statusCode: 500,
};
