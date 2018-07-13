import responses from '../../utils/responses';

export interface IEthereumERC20TransferRequest {
  from: string;
  to: string;
  value: string;
  smartContractAddress: string;
}

export interface IEthereumTokenResponse {
  code: string;
  message: string;
  statusCode: number;
}

export const EthereumBadRequestTokenResponse: IEthereumTokenResponse = {
  code: responses.ndbgeneral400.code,
  message: 'Token ERC20 - Bad request',
  statusCode: 400,
};

export const EthereumErrorTokenResponse: IEthereumTokenResponse = {
  code: responses.ndbsmartcontract500.code,
  message: 'Token ERC20 - Blockchain request error',
  statusCode: 500,
};

export const EthereumOkTokenResponse: IEthereumTokenResponse = {
  code: responses.ndbsmartcontract202.code,
  message: 'Token ERC20 - Operation successfully requested',
  statusCode: 202,
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
