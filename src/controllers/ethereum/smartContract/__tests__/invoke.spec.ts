
import 'jest';
import * as domain from '../../../../domain/ethereum';
import { EthereumSmartContractSuccessResponse } from '../../../../models/ethereum';
import * as utils from '../../../../utils/utils';
import * as ethereumScInvokeController from '../index';

jest.mock('../../../../domain/ethereum');
jest.mock('../../../../utils/utils');

describe('ethereumScInvokeController', async () => {
  let req: any;
  let res: any;
  let next: any;

  const utilsCreateReplyMock = (utils.createReply as jest.Mock);

  beforeEach(() => {

    res = {
      send: jest.fn(),
    };

    next = jest.fn();

    utilsCreateReplyMock.mockReset();

  });

  describe('should call domain.invoke', async () => {

    const domainInvokeMock = (domain.invoke as jest.Mock);

    beforeEach(() => {

      req = {
        body: {},
      };

      domainInvokeMock.mockReset();

    });

    it('and return the response', async () => {

      domainInvokeMock.mockResolvedValue('mockResult');

      await ethereumScInvokeController.invoke(req, res, next);

      expect(domainInvokeMock).toHaveBeenCalledTimes(1);
      expect(domainInvokeMock).toHaveBeenCalledWith(req.body);

      expect(utilsCreateReplyMock).toHaveBeenCalledTimes(1);
      expect(utilsCreateReplyMock).toHaveBeenCalledWith(res, EthereumSmartContractSuccessResponse, 'mockResult');

    });

    it('and fail if there is a problem', async () => {

      const errThrowed = new Error('Boom!');
      domainInvokeMock.mockRejectedValue(errThrowed);

      await ethereumScInvokeController.invoke(req, res, next);

      expect(domainInvokeMock).toHaveBeenCalledTimes(1);
      expect(domainInvokeMock).toHaveBeenCalledWith(req.body);

      expect(utilsCreateReplyMock).toHaveBeenCalledTimes(1);
      expect(utilsCreateReplyMock).toHaveBeenCalledWith(res, errThrowed);

    });

  });

  describe('should call domain.invokeByQuery', async () => {

    const domainInvokeByQueryMock = (domain.invokeByQuery as jest.Mock);

    beforeEach(() => {

      req = {
        body: {},
        params: {
          query: 'queryMocked',
        },
      };

      domainInvokeByQueryMock.mockReset();

    });

    it('and return the response', async () => {

      domainInvokeByQueryMock.mockResolvedValue('mockResult');

      await ethereumScInvokeController.invokeByQuery(req, res, next);

      expect(domainInvokeByQueryMock).toHaveBeenCalledTimes(1);
      expect(domainInvokeByQueryMock).toHaveBeenCalledWith(req.params.query, req.body);

      expect(utilsCreateReplyMock).toHaveBeenCalledTimes(1);
      expect(utilsCreateReplyMock).toHaveBeenCalledWith(res, EthereumSmartContractSuccessResponse, 'mockResult');

    });

    it('and fail if there is a problem', async () => {

      const errThrowed = new Error('Boom!');
      domainInvokeByQueryMock.mockRejectedValue(errThrowed);

      await ethereumScInvokeController.invokeByQuery(req, res, next);

      expect(domainInvokeByQueryMock).toHaveBeenCalledTimes(1);
      expect(domainInvokeByQueryMock).toHaveBeenCalledWith(req.params.query, req.body);

      expect(utilsCreateReplyMock).toHaveBeenCalledTimes(1);
      expect(utilsCreateReplyMock).toHaveBeenCalledWith(res, errThrowed);

    });

  });

});
