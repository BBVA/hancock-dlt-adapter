import responses from '../../utils/responses';

export interface IEthereumResponse {
  code: string;
  message: string;
  statusCode: number;
}

export const EthereumBadRequestResponse: IEthereumResponse = {
  code: responses.ndbgeneral400.code,
  message: 'Ethereum - Bad request',
  statusCode: 400,
};

export const EthereumErrorResponse: IEthereumResponse = {
  code: responses.ndbsmartcontract500.code,
  message: 'Ethereum - Blockchain request error',
  statusCode: 500,
};

export const EthereumOkResponse: IEthereumResponse = {
  code: responses.ndbsmartcontract202.code,
  message: 'Ethereum - Operation successfully requested',
  statusCode: 202,
};

export * from './common';
export * from './transfer';
export * from './smartContract';
