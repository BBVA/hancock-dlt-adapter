
import 'jest';
import * as domain from '../../../../domain/ethereum';
import { ethereumSmartContractSuccessResponse } from '../../../../models/ethereum';
import * as utils from '../../../../utils/utils';
import * as ethereumScRegisterController from '../index';

jest.mock('../../../../domain/ethereum');
jest.mock('../../../../utils/utils');

describe('ethereumScRegisterController', async () => {
  let req: any;
  let res: any;
  let next: any;

  const utilsCreateReplyMock = (utils.createReply as jest.Mock);
  const domainRegisterMock = (domain.register as jest.Mock);

  beforeEach(() => {

    req = {
      body: {
        abi: 'mockedAbi',
        address: 'mockedAddress',
        alias: 'mockedAlias',
      },
    };

    res = {
      send: jest.fn(),
    };

    next = jest.fn();

    utilsCreateReplyMock.mockReset();
    domainRegisterMock.mockReset();

  });

  it('should call domain.register and return the response', async () => {

    domainRegisterMock.mockResolvedValue('mockResult');

    await ethereumScRegisterController.register(req, res, next);

    expect(domainRegisterMock).toHaveBeenCalledTimes(1);
    expect(domainRegisterMock).toHaveBeenCalledWith(req.body.alias, req.body.address, req.body.abi);

    expect(utilsCreateReplyMock).toHaveBeenCalledTimes(1);
    expect(utilsCreateReplyMock).toHaveBeenCalledWith(res, ethereumSmartContractSuccessResponse, 'mockResult');

  });

  it('should call domain.register and fail if there is a problem', async () => {

    const errThrowed = new Error('Boom!');
    domainRegisterMock.mockRejectedValue(errThrowed);

    await ethereumScRegisterController.register(req, res, next);

    expect(domainRegisterMock).toHaveBeenCalledTimes(1);
    expect(domainRegisterMock).toHaveBeenCalledWith(req.body.alias, req.body.address, req.body.abi);

    expect(utilsCreateReplyMock).toHaveBeenCalledTimes(1);
    expect(utilsCreateReplyMock).toHaveBeenCalledWith(res, errThrowed);

  });

});
