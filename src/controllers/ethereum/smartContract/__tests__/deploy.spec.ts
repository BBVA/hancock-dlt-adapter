
import 'jest';
import * as domain from '../../../../domain/ethereum';
import { ethereumSmartContractSuccessResponse } from '../../../../models/ethereum';
import * as utils from '../../../../utils/utils';
import * as ethereumScDeployController from '../index';

jest.mock('../../../../domain/ethereum');
jest.mock('../../../../utils/utils');

describe('ethereumScDeployController', async () => {
  let req: any;
  let res: any;
  let next: any;

  const utilsCreateReplyMock = (utils.createReply as jest.Mock);
  const domainDeployMock = (domain.deploy as jest.Mock);

  beforeEach(() => {

    req = {
      body: {},
    };

    res = {
      send: jest.fn(),
    };

    next = jest.fn();

    utilsCreateReplyMock.mockReset();
    domainDeployMock.mockReset();

  });

  it('should call domain.deploy and return the response', async () => {

    domainDeployMock.mockResolvedValue('mockResult');

    await ethereumScDeployController.deploy(req, res, next);

    expect(domainDeployMock).toHaveBeenCalledTimes(1);
    expect(domainDeployMock).toHaveBeenCalledWith(req.body);

    expect(utilsCreateReplyMock).toHaveBeenCalledTimes(1);
    expect(utilsCreateReplyMock).toHaveBeenCalledWith(res, ethereumSmartContractSuccessResponse, 'mockResult');

  });

  it('should call domain.deploy and fail if there is a problem', async () => {

    const errThrowed = new Error('Boom!');
    domainDeployMock.mockRejectedValue(errThrowed);

    await ethereumScDeployController.deploy(req, res, next);

    expect(domainDeployMock).toHaveBeenCalledTimes(1);
    expect(domainDeployMock).toHaveBeenCalledWith(req.body);

    expect(utilsCreateReplyMock).toHaveBeenCalledTimes(1);
    expect(utilsCreateReplyMock).toHaveBeenCalledWith(res, errThrowed);

  });

});
