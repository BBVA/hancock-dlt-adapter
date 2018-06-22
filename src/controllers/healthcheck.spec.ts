
import 'jest';
import { healthCheckController } from '../controllers/healthcheck';
import config from '../utils/config';

jest.mock('../utils/config', () => ({
  application: 'whatever',
}));

describe('protocolController', async () => {
  let req: any;
  let res: any;
  let next: any;

  beforeEach(() => {

    req = {};

    res = {
      json: jest.fn(),
      status: jest.fn(),
    };

    next = jest.fn();

  });

  it('should encode the payload successfully', async () => {

    req = {
      body: {} as IProtocolEncodeRequest,
    };

    const domainEncodeMock = (domain.encode as jest.Mock).mockReturnValue('mockResult');

    await healthCheckController(req, res, next);

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
