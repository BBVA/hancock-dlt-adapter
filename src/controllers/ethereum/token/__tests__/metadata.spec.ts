
import 'jest';
import * as domain from '../../../../domain/ethereum/token';
import { EthereumErrorTokenResponse, EthereumTokenMetadataSuccessResponse } from '../../../../models/ethereum';
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
  const domainTokenMock = (domain.getTokenMetadata as jest.Mock);

  beforeEach(() => {

    req = {
      params: {
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

  it('should call domain.getTokenMetadata and return the response', async () => {

    const response = {
      decimals: 10,
      name: 'mockName',
      symbol: 'mockSymbol',
      totalSupply: 1000,
    };

    domainTokenMock.mockResolvedValue(response);

    await ethereumTokenController.getTokenMetadata(req, res, next);

    expect(domainTokenMock).toHaveBeenCalledTimes(1);
    expect(domainTokenMock).toHaveBeenCalledWith('mockedAddressAlias');

    expect(utilsCreateReplyMock).toHaveBeenCalledTimes(1);
    expect(utilsCreateReplyMock).toHaveBeenCalledWith(res, EthereumTokenMetadataSuccessResponse, response);

  });

  it('should call domain.getTokenMetadata and fail if there is a problem', async () => {

    domainTokenMock.mockRejectedValue(EthereumErrorTokenResponse);

    await ethereumTokenController.getTokenMetadata(req, res, next);

    expect(domainTokenMock).toHaveBeenCalledTimes(1);
    expect(domainTokenMock).toHaveBeenCalledWith('mockedAddressAlias');

    expect(utilsCreateReplyMock).toHaveBeenCalledTimes(1);
    expect(utilsCreateReplyMock).toHaveBeenCalledWith(res, EthereumErrorTokenResponse);

  });

});
