
import 'jest';
import * as domain from '../../../../domain/ethereum';
import { ethereumSmartContractSuccessResponse } from '../../../../models/ethereum';
import * as utils from '../../../../utils/utils';
import * as ethereumScRetrieveController from '../index';

jest.mock('../../../../domain/ethereum');
jest.mock('../../../../utils/utils');

describe('ethereumScRetrieveController', async () => {
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

  describe('should call domain.find', async () => {

    const domainFindMock = (domain.find as jest.Mock);

    beforeEach(() => {

      domainFindMock.mockReset();

    });

    it('and return the response', async () => {

      domainFindMock.mockResolvedValue('mockResult');

      await ethereumScRetrieveController.find(req, res, next);

      expect(domainFindMock).toHaveBeenCalledTimes(1);

      expect(utilsCreateReplyMock).toHaveBeenCalledTimes(1);

      expect(utilsCreateReplyMock).toHaveBeenCalledWith(res, ethereumSmartContractSuccessResponse, { list: 'mockResult' });

    });

    it('and fail if there is a problem', async () => {

      const errThrowed = new Error('Boom!');
      domainFindMock.mockRejectedValue(errThrowed);

      await ethereumScRetrieveController.find(req, res, next);

      expect(domainFindMock).toHaveBeenCalledTimes(1);

      expect(next).toHaveBeenCalledTimes(1);

    });

  });

  describe('should call domain.findOne', async () => {

    const domainFindOneMock = (domain.findOne as jest.Mock);

    beforeEach(() => {

      req = {
        params: {
          addressOrAlias: 'queryMocked',
        },
      };

      domainFindOneMock.mockReset();

    });

    it('and return the response', async () => {

      domainFindOneMock.mockResolvedValue('mockResult');

      await ethereumScRetrieveController.findOne(req, res, next);

      expect(domainFindOneMock).toHaveBeenCalledTimes(1);
      expect(domainFindOneMock).toHaveBeenCalledWith(req.params.addressOrAlias);

      expect(utilsCreateReplyMock).toHaveBeenCalledTimes(1);
      expect(utilsCreateReplyMock).toHaveBeenCalledWith(res, ethereumSmartContractSuccessResponse, 'mockResult');

    });

    it('and fail if there is a problem', async () => {

      const errThrowed = new Error('Boom!');
      domainFindOneMock.mockRejectedValue(errThrowed);

      await ethereumScRetrieveController.findOne(req, res, next);

      expect(domainFindOneMock).toHaveBeenCalledTimes(1);
      expect(domainFindOneMock).toHaveBeenCalledWith(req.params.addressOrAlias);

      expect(next).toHaveBeenCalledTimes(1);

    });

  });

});
