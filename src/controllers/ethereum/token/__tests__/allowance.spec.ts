
import 'jest';
import * as domain from '../../../../domain/ethereum';
import { ethereumTokenAllowanceSuccessResponse } from '../../../../models/ethereum';
import * as utils from '../../../../utils/utils';
import * as ethereumTokenAllowanceController from '../index';

jest.mock('../../../../domain/ethereum');
jest.mock('../../../../utils/utils');
jest.mock('../../../../domain/ethereum/token');

describe('tokenAllowanceController', async () => {
  let req: any;
  let res: any;
  let next: any;

  const utilsCreateReplyMock = (utils.createReply as jest.Mock);
  const domainTokenAllowanceMock = (domain.tokenAllowance as jest.Mock);
  const domainTokenAllowanceByQueryMock = (domain.tokenAllowanceByQuery as jest.Mock);

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
    domainTokenAllowanceMock.mockReset();
    domainTokenAllowanceByQueryMock.mockReset();

  });

  it('should call domain.tokenAllowance and return the response', async () => {

    domainTokenAllowanceMock.mockResolvedValue('mockResult');

    await ethereumTokenAllowanceController.tokenAllowance(req, res, next);

    expect(domainTokenAllowanceMock).toHaveBeenCalledTimes(1);
    expect(domainTokenAllowanceMock).toHaveBeenCalledWith('mockedQuery');

    expect(utilsCreateReplyMock).toHaveBeenCalledTimes(1);
    expect(utilsCreateReplyMock).toHaveBeenCalledWith(res, ethereumTokenAllowanceSuccessResponse, 'mockResult');

  });

  it('should call domain.tokenAllowance and fail if there is a problem', async () => {

    const errThrowed = new Error('Boom!');
    domainTokenAllowanceMock.mockRejectedValue(errThrowed);

    await ethereumTokenAllowanceController.tokenAllowance(req, res, next);

    expect(domainTokenAllowanceMock).toHaveBeenCalledTimes(1);
    expect(domainTokenAllowanceMock).toHaveBeenCalledWith('mockedQuery');

    expect(utilsCreateReplyMock).toHaveBeenCalledTimes(1);
    expect(utilsCreateReplyMock).toHaveBeenCalledWith(res, errThrowed);

  });

  it('should call domain.tokenAllowanceByQuery and return the response', async () => {

    domainTokenAllowanceByQueryMock.mockResolvedValue('mockResult');

    await ethereumTokenAllowanceController.tokenAllowanceByQuery(req, res, next);

    expect(domainTokenAllowanceByQueryMock).toHaveBeenCalledTimes(1);
    expect(domainTokenAllowanceByQueryMock).toHaveBeenCalledWith('mockedAddress', 'mockedQuery');

    expect(utilsCreateReplyMock).toHaveBeenCalledTimes(1);
    expect(utilsCreateReplyMock).toHaveBeenCalledWith(res, ethereumTokenAllowanceSuccessResponse, 'mockResult');

  });

  it('should call domain.tokenAllowanceByQuery and fail if there is a problem', async () => {

    const errThrowed = new Error('Boom!');
    domainTokenAllowanceByQueryMock.mockRejectedValue(errThrowed);

    await ethereumTokenAllowanceController.tokenAllowanceByQuery(req, res, next);

    expect(domainTokenAllowanceByQueryMock).toHaveBeenCalledTimes(1);
    expect(domainTokenAllowanceByQueryMock).toHaveBeenCalledWith('mockedAddress', 'mockedQuery');

    expect(utilsCreateReplyMock).toHaveBeenCalledTimes(1);
    expect(utilsCreateReplyMock).toHaveBeenCalledWith(res, errThrowed);

  });

});
