
import 'jest';
import * as protocolController from '../controllers/protocol';
import * as domain from '../domain/protocol';
import { IProtocolDecodeRequest, IProtocolEncodeRequest, ProtocolRequestOkResponse } from '../models/protocol';
import * as utils from '../utils/utils';

jest.mock('../domain/protocol');
jest.mock('../utils/utils');

describe('protocolController', async () => {
  let req: any;
  let res: any;
  let next: any;

  const utilsCreateReplyMock = (utils.createReply as jest.Mock);

  beforeEach(() => {

    res = {
      send: jest.fn(),
    };

    next = jest.fn();

    utilsCreateReplyMock.mockReset();

  });

  it('should encode the payload successfully', async () => {

    req = {
      body: {} as IProtocolEncodeRequest,
    };

    const domainEncodeMock = (domain.encode as jest.Mock).mockReturnValue('mockResult');

    await protocolController.encode(req, res, next);

    expect(domainEncodeMock.mock.calls.length).toBe(1);
    expect(domainEncodeMock.mock.calls).toEqual([[req.body]]);

    expect(utilsCreateReplyMock.mock.calls.length).toBe(1);
    expect(utilsCreateReplyMock.mock.calls).toEqual([[res, ProtocolRequestOkResponse, { qrEncode: 'mockResult' }]]);

  });

  it('should decode the payload successfully', async () => {

    req = {
      body: {
        code: 'whatever',
      } as IProtocolDecodeRequest,
    };

    const domainDecodeMock = (domain.decode as jest.Mock).mockReturnValue('mockResult');

    await protocolController.decode(req, res, next);

    expect(domainDecodeMock.mock.calls.length).toBe(1);
    expect(domainDecodeMock.mock.calls).toEqual([[req.body.code]]);

    expect(utilsCreateReplyMock.mock.calls.length).toBe(1);
    expect(utilsCreateReplyMock.mock.calls).toEqual([[res, ProtocolRequestOkResponse, 'mockResult']]);

  });
});
