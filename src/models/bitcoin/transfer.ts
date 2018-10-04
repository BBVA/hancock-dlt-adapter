import responses from '../../utils/responses';
import { IHancockTransferSendRequest } from '../common';

export type IBitcoinTransferSendRequest = IHancockTransferSendRequest;

export interface IBitcoinTransferResponse {
  code: string;
  message: string;
  statusCode: number;
}

export const bitcoinTransferBadRequestResponse: IBitcoinTransferResponse = {
  code: responses.ndbgeneral400.code,
  message: 'BitcoinTransfer - Bad request',
  statusCode: 400,
};

export const bitcoinTransferDDBBErrorResponse: IBitcoinTransferResponse = {
  code: responses.ndbsmartcontract500.code,
  message: 'BitcoinTransfer - Internal ddbb error',
  statusCode: 500,
};

export const bitcoinTransferErrorResponse: IBitcoinTransferResponse = {
  code: responses.ndbsmartcontract500.code,
  message: 'BitcoinTransfer - Blockchain request error',
  statusCode: 500,
};

export const bitcoinTransferOkResponse: IBitcoinTransferResponse = {
  code: responses.ndbsmartcontract202.code,
  message: 'BitcoinTransfer - Blockchain transaction successfully sent. Consensus pending',
  statusCode: 202,
};

export const bitcoinTransferSyncOkResponse: IBitcoinTransferResponse = {
  code: responses.ndbsmartcontract202.code,
  message: 'BitcoinTransfer - Blockchain transaction successful',
  statusCode: 200,
};
