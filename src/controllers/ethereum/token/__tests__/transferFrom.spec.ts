
import 'jest';
import * as domain from '../../../../domain/ethereum';
import { ethereumTokenTransferFromSuccessResponse } from '../../../../models/ethereum';
import * as utils from '../../../../utils/utils';
import * as ethereumTokenTransferFromController from '../index';

jest.mock('../../../../domain/ethereum');
jest.mock('../../../../utils/utils');
jest.mock('../../../../domain/ethereum/token');

describe('tokenTransferFromController', async () => {
  let req: any;
  let res: any;
  let next: any;

  const utilsCreateReplyMock = (utils.createReply as jest.Mock);
  const domainTokenTransferFromMock = (domain.tokenTransferFrom as jest.Mock);
  const domainTokenTransferFromByQueryMock = (domain.tokenTransferFromByQuery as jest.Mock);

  beforeEach(() => {

    req = {
      body: 'mockedQuery',
      params: {
        query: 'mockedAddress',
      },
    };

    res = {
      send: jest.fn(),
    };

    next = jest.fn();

    utilsCreateReplyMock.mockReset();
    domainTokenTransferFromMock.mockReset();
    domainTokenTransferFromByQueryMock.mockReset();

  });

  it('should call domain.tokenTransferFrom and return the response', async () => {

    domainTokenTransferFromMock.mockResolvedValue('mockResult');

    await ethereumTokenTransferFromController.tokenTransferFrom(req, res, next);

    expect(domainTokenTransferFromMock).toHaveBeenCalledTimes(1);
    expect(domainTokenTransferFromMock).toHaveBeenCalledWith('mockedQuery');

    expect(utilsCreateReplyMock).toHaveBeenCalledTimes(1);
    expect(utilsCreateReplyMock).toHaveBeenCalledWith(res, ethereumTokenTransferFromSuccessResponse, 'mockResult');

  });

  it('should call domain.tokenTransferFrom and fail if there is a problem', async () => {

    const errThrowed = new Error('Boom!');
    domainTokenTransferFromMock.mockRejectedValue(errThrowed);

    await ethereumTokenTransferFromController.tokenTransferFrom(req, res, next);

    expect(domainTokenTransferFromMock).toHaveBeenCalledTimes(1);
    expect(domainTokenTransferFromMock).toHaveBeenCalledWith('mockedQuery');

    expect(next).toHaveBeenCalledTimes(1);

  });

  it('should call domain.tokenTransferFromByQuery and return the response', async () => {

    domainTokenTransferFromByQueryMock.mockResolvedValue('mockResult');

    await ethereumTokenTransferFromController.tokenTransferFromByQuery(req, res, next);

    expect(domainTokenTransferFromByQueryMock).toHaveBeenCalledTimes(1);
    expect(domainTokenTransferFromByQueryMock).toHaveBeenCalledWith('mockedAddress', 'mockedQuery');

    expect(utilsCreateReplyMock).toHaveBeenCalledTimes(1);
    expect(utilsCreateReplyMock).toHaveBeenCalledWith(res, ethereumTokenTransferFromSuccessResponse, 'mockResult');

  });

  it('should call domain.tokenTransferFromByQuery and fail if there is a problem', async () => {

    const errThrowed = new Error('Boom!');
    domainTokenTransferFromByQueryMock.mockRejectedValue(errThrowed);

    await ethereumTokenTransferFromController.tokenTransferFromByQuery(req, res, next);

    expect(domainTokenTransferFromByQueryMock).toHaveBeenCalledTimes(1);
    expect(domainTokenTransferFromByQueryMock).toHaveBeenCalledWith('mockedAddress', 'mockedQuery');

    expect(next).toHaveBeenCalledTimes(1);

  });

});
