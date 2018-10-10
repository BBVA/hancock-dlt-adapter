import 'jest';
import * as domain from '../../../../domain/ethereum';
import { ethereumTokenFindAllSuccessResponse } from '../../../../models/ethereum';
import * as utils from '../../../../utils/utils';
import * as ethereumTokenRetrieveController from '../index';

jest.mock('../../../../domain/ethereum');
jest.mock('../../../../utils/utils');

describe('ethereumTokenRetrieveController', async () => {
  const req: any = {};
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

    const domainFindMock = (domain.tokenFindAll as jest.Mock);

    beforeEach(() => {

      domainFindMock.mockReset();

    });

    it('and return the response', async () => {

      domainFindMock.mockResolvedValue('mockResult');

      await ethereumTokenRetrieveController.tokenFindAll(req, res, next);

      expect(domainFindMock).toHaveBeenCalledTimes(1);

      expect(utilsCreateReplyMock).toHaveBeenCalledTimes(1);

      expect(utilsCreateReplyMock).toHaveBeenCalledWith(res, ethereumTokenFindAllSuccessResponse, 'mockResult' );

    });

    it('and fail if there is a problem', async () => {

      const errThrowed = new Error('Boom!');
      domainFindMock.mockRejectedValue(errThrowed);

      await ethereumTokenRetrieveController.tokenFindAll(req, res, next);

      expect(domainFindMock).toHaveBeenCalledTimes(1);

      expect(next).toHaveBeenCalledTimes(1);

    });

  });

});
