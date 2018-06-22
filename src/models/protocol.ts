import responses from '../utils/responses';

export interface IProtocolResponse {
  code: string;
  message: string;
  statusCode: number;
}

export interface IProtocolDecodeRequest {
  code: string;
}

export interface IProtocolEncodeRequest {
  action: 'transfer';
  body: {
    to: string;
    value: string;
    data: string;
  };
  dlt: 'ethereum';
}

export const ProtocolBadRequestResponse: IProtocolResponse = {
  code: responses.ndbgeneral400.code,
  message: 'Bad request',
  statusCode: 400,
};

export const ProtocolRequestErrorResponse: IProtocolResponse = {
  code: responses.ndbgeneral500.code,
  message: 'Request error',
  statusCode: 500,
};

export const ProtocolRequestOkResponse: IProtocolResponse = {
  code: responses.ndbgeneral200.code,
  message: 'Operation successfully requested',
  statusCode: 200,
};
