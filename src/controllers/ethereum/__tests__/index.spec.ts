
import 'jest';
import * as domain from '../../../domain/ethereum';
import { ethereumErrorResponse, ethereumOkResponse } from '../../../models/ethereum';
import * as utils from '../../../utils/utils';
import * as ethereumController from '../index';

jest.mock('../transfer');
jest.mock('../smartContract');
jest.mock('../../../domain/ethereum');
jest.mock('../../../utils/utils');
jest.mock('../../../db/ethereum');
jest.mock('../../../utils/logger');

describe('ethereumController', async () => {
  let req: any;
  let res: any;
  let next: any;

  const utilsCreateReplyMock = (utils.createReply as jest.Mock);
  const domainGetBalanceMock = (domain.getBalance as jest.Mock);

  beforeEach(() => {

    req = {
      params: {
        address: 'mockedAddress',
      },
    };

    res = {
      send: jest.fn(),
    };

    next = jest.fn();

    utilsCreateReplyMock.mockReset();
    domainGetBalanceMock.mockReset();

  });

  it('should call domain.getBalance and return the address balance', async () => {

    domainGetBalanceMock.mockResolvedValue('mockResult');

    await ethereumController.getBalance(req, res, next);

    expect(domainGetBalanceMock).toHaveBeenCalledTimes(1);
    expect(domainGetBalanceMock).toHaveBeenCalledWith('mockedAddress');

    expect(utilsCreateReplyMock).toHaveBeenCalledTimes(1);
    expect(utilsCreateReplyMock).toHaveBeenCalledWith(res, ethereumOkResponse, {balance: 'mockResult'});

  });

  it('should call domain.getBalance and fail if there is a problem', async () => {

    domainGetBalanceMock.mockRejectedValue(new Error('Boom!'));

    await ethereumController.getBalance(req, res, next);

    expect(domainGetBalanceMock).toHaveBeenCalledTimes(1);
    expect(domainGetBalanceMock).toHaveBeenCalledWith('mockedAddress');

    expect(next).toHaveBeenCalledTimes(1);

  });

});
