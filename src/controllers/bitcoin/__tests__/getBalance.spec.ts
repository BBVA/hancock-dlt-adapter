
import 'jest';
import * as domain from '../../../domain/bitcoin/getBalance';
import { bitcoinOkResponse } from '../../../models/bitcoin';
import * as utils from '../../../utils/utils';
import * as getBalanceController from '../index';

jest.mock('../../../domain/bitcoin');
jest.mock('../../../domain/bitcoin/getBalance');
jest.mock('../../../utils/utils');
jest.mock('../../../utils/logger');

describe('getBalanceController', async () => {
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

    await getBalanceController.getBalance(req, res, next);

    expect(domainGetBalanceMock).toHaveBeenCalledTimes(1);
    expect(domainGetBalanceMock).toHaveBeenCalledWith('mockedAddress');

    expect(utilsCreateReplyMock).toHaveBeenCalledTimes(1);
    expect(utilsCreateReplyMock).toHaveBeenCalledWith(res, bitcoinOkResponse, {balance: 'mockResult'});

  });

  it('should call domain.getBalance and fail if there is a problem', async () => {

    domainGetBalanceMock.mockRejectedValue(new Error('Boom!'));

    await getBalanceController.getBalance(req, res, next);

    expect(domainGetBalanceMock).toHaveBeenCalledTimes(1);
    expect(domainGetBalanceMock).toHaveBeenCalledWith('mockedAddress');

    expect(next).toHaveBeenCalledTimes(1);

  });

});
