
import 'jest';
import * as domain from '../../../domain/ethereum';
import {
  ethereumTransferErrorResponse,
  ethereumTransferSyncOkResponse,
  IEthereumTransferSendRequest,
} from '../../../models/ethereum';
import * as utils from '../../../utils/utils';
import * as transferController from '../transfer';

jest.mock('../../../domain/ethereum');
jest.mock('../../../utils/utils');

describe('transferController', async () => {
  let req: any;
  let res: any;
  let next: any;

  const utilsCreateReplyMock = (utils.createReply as jest.Mock);
  const domainSendTransferMock = (domain.sendTransfer as jest.Mock);

  beforeEach(() => {

    res = {
      send: jest.fn(),
    };

    next = jest.fn();

    utilsCreateReplyMock.mockReset();
    domainSendTransferMock.mockReset();

  });

  it('should call domain.sendTransfer with the payload successfully', async () => {

    req = {
      body: {} as IEthereumTransferSendRequest,
    };

    domainSendTransferMock.mockResolvedValue('mockResult');

    await transferController.sendTransfer(req, res, next);

    expect(domainSendTransferMock.mock.calls.length).toBe(1);
    expect(domainSendTransferMock.mock.calls).toEqual([[req.body]]);

    expect(utilsCreateReplyMock.mock.calls.length).toBe(1);
    expect(utilsCreateReplyMock.mock.calls).toEqual([[res, ethereumTransferSyncOkResponse, 'mockResult']]);

  });

  it('should call domain.sendTransfer and fail if there is a problem', async () => {

    req = {
      body: {} as IEthereumTransferSendRequest,
    };

    domainSendTransferMock.mockRejectedValue(new Error('Boom!'));

    await transferController.sendTransfer(req, res, next);

    expect(domainSendTransferMock.mock.calls.length).toBe(1);
    expect(domainSendTransferMock.mock.calls).toEqual([[req.body]]);

    expect(utilsCreateReplyMock.mock.calls.length).toBe(1);
    expect(utilsCreateReplyMock.mock.calls).toEqual([[res, ethereumTransferErrorResponse]]);

  });

});
