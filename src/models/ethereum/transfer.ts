import responses from '../../components/responses';

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

export const EthereumTransferBadRequestResponse: IEthereumTransferResponse = {
  code: responses.ndbgeneral400.code,
  message: 'EthereumTransfer - Bad request',
  statusCode: 400,
};

export const EthereumTransferDDBBErrorResponse: IEthereumTransferResponse = {
  code: responses.ndbsmartcontract500.code,
  message: 'EthereumTransfer - Internal ddbb error',
  statusCode: 500,
};

export const EthereumTransferErrorResponse: IEthereumTransferResponse = {
  code: responses.ndbsmartcontract500.code,
  message: 'EthereumTransfer - Blockchain request error',
  statusCode: 500,
};

export const EthereumTransferOkResponse: IEthereumTransferResponse = {
  code: responses.ndbsmartcontract202.code,
  message: 'EthereumTransfer - Blockchain transaction successfully sent. Consensus pending',
  statusCode: 202,
};

export const EthereumTransferSyncOkResponse: IEthereumTransferResponse = {
  code: responses.ndbsmartcontract202.code,
  message: 'EthereumTransfer - Blockchain transaction successful',
  statusCode: 200,
};
