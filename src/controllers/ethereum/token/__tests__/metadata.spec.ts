
import 'jest';
import * as domain from '../../../../domain/ethereum/token';
import { ethereumErrorTokenResponse, ethereumTokenMetadataSuccessResponse } from '../../../../models/ethereum';
import * as utils from '../../../../utils/utils';
import * as ethereumTokenController from '../index';

jest.mock('../../../../domain/ethereum');
jest.mock('../../../../utils/utils');
jest.mock('../../../../domain/ethereum/token');

describe('metadataController', async () => {
  let req: any;
  let res: any;
  let next: any;

  const utilsCreateReplyMock = (utils.createReply as jest.Mock);
  const domainTokenMock = (domain.getTokenMetadata as jest.Mock);
  const domainTokenByQueryMock = (domain.getTokenMetadataByQuery as jest.Mock);

  beforeEach(() => {

    req = {
      params: {
        query: 'mockedAddressAlias',
      },
      query: {
        address: 'mockedAddress',
      },
    };

    res = {
      send: jest.fn(),
    };

    next = jest.fn();

    utilsCreateReplyMock.mockReset();
    domainTokenByQueryMock.mockReset();
    domainTokenMock.mockReset();

  });

  describe('metadata getTokenMetaDataByQuery', async () => {

    it('should call domain.getTokenMetaDataByQuery and return the response', async () => {

      const response = {
        decimals: 10,
        name: 'mockName',
        symbol: 'mockSymbol',
        totalSupply: 1000,
      };

      domainTokenByQueryMock.mockResolvedValue(response);

      await ethereumTokenController.getTokenMetadataByQuery(req, res, next);

      expect(domainTokenByQueryMock).toHaveBeenCalledTimes(1);
      expect(domainTokenByQueryMock).toHaveBeenCalledWith('mockedAddressAlias');

      expect(utilsCreateReplyMock).toHaveBeenCalledTimes(1);
      expect(utilsCreateReplyMock).toHaveBeenCalledWith(res, ethereumTokenMetadataSuccessResponse, response);

    });

    it('should call domain.getTokenMetadata and fail if there is a problem', async () => {

      domainTokenByQueryMock.mockRejectedValue(ethereumErrorTokenResponse);

      await ethereumTokenController.getTokenMetadataByQuery(req, res, next);

      expect(domainTokenByQueryMock).toHaveBeenCalledTimes(1);
      expect(domainTokenByQueryMock).toHaveBeenCalledWith('mockedAddressAlias');

      expect(next).toHaveBeenCalledTimes(1);

    });

  });

  describe('metadata getTokenMetaData', async () => {

    it('should call domain.getTokenMetaData and return the response', async () => {

      const response = {
        decimals: 10,
        name: 'mockName',
        symbol: 'mockSymbol',
        totalSupply: 1000,
      };

      domainTokenMock.mockResolvedValue(response);

      await ethereumTokenController.getTokenMetadata(req, res, next);

      expect(domainTokenMock).toHaveBeenCalledTimes(1);
      expect(domainTokenMock).toHaveBeenCalledWith('mockedAddress');

      expect(utilsCreateReplyMock).toHaveBeenCalledTimes(1);
      expect(utilsCreateReplyMock).toHaveBeenCalledWith(res, ethereumTokenMetadataSuccessResponse, response);

    });

    it('should call domain.getTokenMetadata and fail if there is a problem', async () => {

      domainTokenMock.mockRejectedValue(ethereumErrorTokenResponse);

      await ethereumTokenController.getTokenMetadata(req, res, next);

      expect(domainTokenMock).toHaveBeenCalledTimes(1);
      expect(domainTokenMock).toHaveBeenCalledWith('mockedAddress');

      expect(next).toHaveBeenCalledTimes(1);

    });

  });

});
