
import 'jest';
import * as domain from '../../../../domain/ethereum/token';
import { ethereumErrorTokenResponse, ethereumTokenApproveTransferSuccessResponse } from '../../../../models/ethereum';
import * as utils from '../../../../utils/utils';
import * as ethereumTokenController from '../index';

jest.mock('../../../../domain/ethereum');
jest.mock('../../../../utils/utils');
jest.mock('../../../../domain/ethereum/token');

describe('approveController', async () => {
  let req: any;
  let res: any;
  let next: any;

  const utilsCreateReplyMock = (utils.createReply as jest.Mock);
  const domainTokenMock = (domain.tokenApproveTransfer as jest.Mock);
  const domainTokenByQueryMock = (domain.tokenApproveTransferByQuery as jest.Mock);

  beforeEach(() => {

    req = {
      body: 'mockedAddress',
      params: {
        query: 'mockedQuery',
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

  describe('approve tokenApproveTransferByQuery', async () => {

    it('should call domain.tokenApproveTransferByQuery and return the response', async () => {

      const response = {
        data: 'mockData',
        from: 'mockAddress',
        gas: 10,
        gasPrice: 10,
        to: 'mockAddress',
        value: 10,
      };

      domainTokenByQueryMock.mockResolvedValue(response);

      await ethereumTokenController.tokenApproveTransferByQuery(req, res, next);

      expect(domainTokenByQueryMock).toHaveBeenCalledTimes(1);
      expect(domainTokenByQueryMock).toHaveBeenCalledWith('mockedQuery', 'mockedAddress');

      expect(utilsCreateReplyMock).toHaveBeenCalledTimes(1);
      expect(utilsCreateReplyMock).toHaveBeenCalledWith(res, ethereumTokenApproveTransferSuccessResponse, response);

    });

    it('should call domain.tokenApproveTransferByQuery and fail if there is a problem', async () => {

      domainTokenByQueryMock.mockRejectedValue(ethereumErrorTokenResponse);

      await ethereumTokenController.tokenApproveTransferByQuery(req, res, next);

      expect(domainTokenByQueryMock).toHaveBeenCalledTimes(1);
      expect(domainTokenByQueryMock).toHaveBeenCalledWith('mockedQuery', 'mockedAddress');

      expect(next).toHaveBeenCalledTimes(1);

    });

  });

  describe('approve tokenApproveTransfer', async () => {

    it('should call domain.tokenApproveTransfer and return the response', async () => {

      const response = {
        data: 'mockData',
        from: 'mockAddress',
        gas: 10,
        gasPrice: 10,
        to: 'mockAddress',
        value: 10,
      };
      domainTokenMock.mockResolvedValue(response);

      await ethereumTokenController.tokenApproveTransfer(req, res, next);

      expect(domainTokenMock).toHaveBeenCalledTimes(1);
      expect(domainTokenMock).toHaveBeenCalledWith('mockedAddress');

      expect(utilsCreateReplyMock).toHaveBeenCalledTimes(1);
      expect(utilsCreateReplyMock).toHaveBeenCalledWith(res, ethereumTokenApproveTransferSuccessResponse, response);

    });

    it('should call domain.tokenApproveTransfer and fail if there is a problem', async () => {

      domainTokenMock.mockRejectedValue(ethereumErrorTokenResponse);

      await ethereumTokenController.tokenApproveTransfer(req, res, next);

      expect(domainTokenMock).toHaveBeenCalledTimes(1);
      expect(domainTokenMock).toHaveBeenCalledWith('mockedAddress');

      expect(next).toHaveBeenCalledTimes(1);

    });

  });

});
