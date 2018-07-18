
import 'jest';
import * as domain from '../../../../domain/ethereum/token';
import { EthereumErrorTokenResponse, EthereumOkTokenResponse } from '../../../../models/ethereum';
import * as utils from '../../../../utils/utils';
import * as ethereumTokenController from '../index';

jest.mock('../../../../domain/ethereum');
jest.mock('../../../../utils/utils');
jest.mock('../../../../domain/ethereum/token');

describe('tokenController', async () => {
  let req: any;
  let res: any;
  let next: any;

  const utilsCreateReplyMock = (utils.createReply as jest.Mock);
  const domainTokenMock = (domain.getTokenBalance as jest.Mock);

  beforeEach(() => {

    req = {
      params: {
        address: 'mockedAddress',
        query: 'mockedAddressAlias',
      },
    };

    res = {
      send: jest.fn(),
    };

    next = jest.fn();

    utilsCreateReplyMock.mockReset();
    domainTokenMock.mockReset();

  });

  it('should call domain.getTokenBalance and return the response', async () => {

    domainTokenMock.mockResolvedValue('mockResult');

    await ethereumTokenController.getTokenBalance(req, res, next);

    expect(domainTokenMock).toHaveBeenCalledTimes(1);
    expect(domainTokenMock).toHaveBeenCalledWith('mockedAddressAlias', 'mockedAddress');

    expect(utilsCreateReplyMock).toHaveBeenCalledTimes(1);
    expect(utilsCreateReplyMock).toHaveBeenCalledWith(res, EthereumOkTokenResponse, 'mockResult');

  });

  it('should call domain.getTokenBalance and fail if there is a problem', async () => {

    domainTokenMock.mockRejectedValue(EthereumErrorTokenResponse);

    await ethereumTokenController.getTokenBalance(req, res, next);

    expect(domainTokenMock).toHaveBeenCalledTimes(1);
    expect(domainTokenMock).toHaveBeenCalledWith('mockedAddressAlias', 'mockedAddress');

    expect(utilsCreateReplyMock).toHaveBeenCalledTimes(1);
    expect(utilsCreateReplyMock).toHaveBeenCalledWith(res, EthereumErrorTokenResponse);

  });

});
