
import 'jest';
import * as domain from '../../../../domain/ethereum';
import { ethereumTokenTransferSuccessResponse } from '../../../../models/ethereum';
import * as utils from '../../../../utils/utils';
import * as ethereumTokenTransferController from '../index';

jest.mock('../../../../domain/ethereum');
jest.mock('../../../../utils/utils');
jest.mock('../../../../domain/ethereum/token');

describe('tokenTransferController', async () => {
  let req: any;
  let res: any;
  let next: any;

  const utilsCreateReplyMock = (utils.createReply as jest.Mock);
  const domainTokenTransferMock = (domain.tokenTransfer as jest.Mock);
  const domainTokenTransferByQueryMock = (domain.tokenTransferByQuery as jest.Mock);

  beforeEach(() => {

    req = {
      body: 'mockedQuery',
      params: {
        addressOrAlias: 'mockedAddress',
      },
    };

    res = {
      send: jest.fn(),
    };

    next = jest.fn();

    utilsCreateReplyMock.mockReset();
    domainTokenTransferMock.mockReset();
    domainTokenTransferByQueryMock.mockReset();

  });

  it('should call domain.tokenTransfer and return the response', async () => {

    domainTokenTransferMock.mockResolvedValue('mockResult');

    await ethereumTokenTransferController.tokenTransfer(req, res, next);

    expect(domainTokenTransferMock).toHaveBeenCalledTimes(1);
    expect(domainTokenTransferMock).toHaveBeenCalledWith('mockedQuery');

    expect(utilsCreateReplyMock).toHaveBeenCalledTimes(1);
    expect(utilsCreateReplyMock).toHaveBeenCalledWith(res, ethereumTokenTransferSuccessResponse, 'mockResult');

  });

  it('should call domain.tokenTransfer and fail if there is a problem', async () => {

    const errThrowed = new Error('Boom!');
    domainTokenTransferMock.mockRejectedValue(errThrowed);

    await ethereumTokenTransferController.tokenTransfer(req, res, next);

    expect(domainTokenTransferMock).toHaveBeenCalledTimes(1);
    expect(domainTokenTransferMock).toHaveBeenCalledWith('mockedQuery');

    expect(next).toHaveBeenCalledTimes(1);

  });

  it('should call domain.tokenTransferByQuery and return the response', async () => {

    domainTokenTransferByQueryMock.mockResolvedValue('mockResult');

    await ethereumTokenTransferController.tokenTransferByQuery(req, res, next);

    expect(domainTokenTransferByQueryMock).toHaveBeenCalledTimes(1);
    expect(domainTokenTransferByQueryMock).toHaveBeenCalledWith('mockedAddress', 'mockedQuery');

    expect(utilsCreateReplyMock).toHaveBeenCalledTimes(1);
    expect(utilsCreateReplyMock).toHaveBeenCalledWith(res, ethereumTokenTransferSuccessResponse, 'mockResult');

  });

  it('should call domain.tokenTransferByQuery and fail if there is a problem', async () => {

    const errThrowed = new Error('Boom!');
    domainTokenTransferByQueryMock.mockRejectedValue(errThrowed);

    await ethereumTokenTransferController.tokenTransferByQuery(req, res, next);

    expect(domainTokenTransferByQueryMock).toHaveBeenCalledTimes(1);
    expect(domainTokenTransferByQueryMock).toHaveBeenCalledWith('mockedAddress', 'mockedQuery');

    expect(next).toHaveBeenCalledTimes(1);

  });

});
