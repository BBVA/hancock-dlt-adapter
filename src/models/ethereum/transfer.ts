import responses from '../../utils/responses';

export interface IEthereumTransferSendRequest {
  from: string;
  to: string;
  value: string;
  data?: string;
}

export interface IEthereumTransferResponse {
  code: string;
  message: string;
  statusCode: number;
}

export const ethereumTransferBadRequestResponse: IEthereumTransferResponse = {
  code: responses.ndbgeneral400.code,
  message: 'EthereumTransfer - Bad request',
  statusCode: 400,
};

export const ethereumTransferDDBBErrorResponse: IEthereumTransferResponse = {
  code: responses.ndbsmartcontract500.code,
  message: 'EthereumTransfer - Internal ddbb error',
  statusCode: 500,
};

export const ethereumTransferErrorResponse: IEthereumTransferResponse = {
  code: responses.ndbsmartcontract500.code,
  message: 'EthereumTransfer - Blockchain request error',
  statusCode: 500,
};

export const ethereumTransferOkResponse: IEthereumTransferResponse = {
  code: responses.ndbsmartcontract202.code,
  message: 'EthereumTransfer - Blockchain transaction successfully sent. Consensus pending',
  statusCode: 202,
};

export const ethereumTransferSyncOkResponse: IEthereumTransferResponse = {
  code: responses.ndbsmartcontract202.code,
  message: 'EthereumTransfer - Blockchain transaction successful',
  statusCode: 200,
};
