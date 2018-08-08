
import 'jest';
import * as domain from '../../../../domain/ethereum/token';
import { ethereumErrorTokenResponse, ethereumOkTokenResponse } from '../../../../models/ethereum';
import * as utils from '../../../../utils/utils';
import * as ethereumTokenController from '../balanceOf';

jest.mock('../../../../domain/ethereum');
jest.mock('../../../../utils/utils');
jest.mock('../../../../domain/ethereum/token');

describe('tokenController', async () => {
  let req: any;
  let res: any;
  let next: any;

  const utilsCreateReplyMock = (utils.createReply as jest.Mock);
  const domainTokenBalanceOfMock = (domain.tokenBalanceOf as jest.Mock);
  const domainTokenBalanceOfByQueryMock = (domain.tokenBalanceOfByQuery as jest.Mock);

  beforeEach(() => {

    res = {
      send: jest.fn(),
    };

    next = jest.fn();

    utilsCreateReplyMock.mockReset();
    domainTokenBalanceOfMock.mockReset();
    domainTokenBalanceOfByQueryMock.mockReset();

  });

  describe('::tokenBalanceOf()', () => {

    beforeEach(() => {

      req = {
        query: {
          address: 'mockedAddress',
          contractAddress: 'mockedAddressAlias',
        },
      };

    });

    it('should call domain.tokenBalanceOf and return the response', async () => {

      domainTokenBalanceOfMock.mockResolvedValue('mockResult');

      await ethereumTokenController.tokenBalanceOf(req, res, next);

      expect(domainTokenBalanceOfMock).toHaveBeenCalledTimes(1);
      expect(domainTokenBalanceOfMock).toHaveBeenCalledWith('mockedAddressAlias', 'mockedAddress');

      expect(utilsCreateReplyMock).toHaveBeenCalledTimes(1);
      expect(utilsCreateReplyMock).toHaveBeenCalledWith(res, ethereumOkTokenResponse, 'mockResult');

    });

    it('should call domain.tokenBalanceOf and fail if there is a problem', async () => {

      domainTokenBalanceOfMock.mockRejectedValue(ethereumErrorTokenResponse);

      await ethereumTokenController.tokenBalanceOf(req, res, next);

      expect(domainTokenBalanceOfMock).toHaveBeenCalledTimes(1);
      expect(domainTokenBalanceOfMock).toHaveBeenCalledWith('mockedAddressAlias', 'mockedAddress');

      expect(next).toHaveBeenCalledTimes(1);

    });
  });

  describe('::tokenBalanceOfByQuery()', () => {

    beforeEach(() => {

      req = {
        params: {
          address: 'mockedAddress',
          addressOrAlias: 'mockedAddressAlias',
        },
      };

    });

    it('should call domain.tokenBalanceOfByQuery and return the response', async () => {

      domainTokenBalanceOfByQueryMock.mockResolvedValue('mockResult');

      await ethereumTokenController.tokenBalanceOfByQuery(req, res, next);

      expect(domainTokenBalanceOfByQueryMock).toHaveBeenCalledTimes(1);
      expect(domainTokenBalanceOfByQueryMock).toHaveBeenCalledWith('mockedAddressAlias', 'mockedAddress');

      expect(utilsCreateReplyMock).toHaveBeenCalledTimes(1);
      expect(utilsCreateReplyMock).toHaveBeenCalledWith(res, ethereumOkTokenResponse, 'mockResult');

    });

    it('should call domain.tokenBalanceOfByQuery and fail if there is a problem', async () => {

      domainTokenBalanceOfByQueryMock.mockRejectedValue(ethereumErrorTokenResponse);

      await ethereumTokenController.tokenBalanceOfByQuery(req, res, next);

      expect(domainTokenBalanceOfByQueryMock).toHaveBeenCalledTimes(1);
      expect(domainTokenBalanceOfByQueryMock).toHaveBeenCalledWith('mockedAddressAlias', 'mockedAddress');

      expect(next).toHaveBeenCalledTimes(1);

    });
  });

});
