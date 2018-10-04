import responses from '../../utils/responses';

export interface IBitcoinResponse {
  code: string;
  message: string;
  statusCode: number;
}

export const bitcoinBadRequestResponse: IBitcoinResponse = {
  code: responses.ndbgeneral400.code,
  message: 'Bitcoin - Bad request',
  statusCode: 400,
};

export const bitcoinErrorResponse: IBitcoinResponse = {
  code: responses.ndbsmartcontract500.code,
  message: 'Bitcoin - Blockchain request error',
  statusCode: 500,
};

export const bitcoinOkResponse: IBitcoinResponse = {
  code: responses.ndbsmartcontract202.code,
  message: 'Bitcoin - Operation successfully requested',
  statusCode: 202,
};

export * from './transfer';
