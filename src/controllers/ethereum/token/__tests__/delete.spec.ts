
import 'jest';
import * as domain from '../../../../domain/ethereum';
import * as utils from '../../../../utils/utils';
import * as tokenDeleteController from '../delete';

jest.mock('../../../../domain/ethereum');
jest.mock('../../../../domain/ethereum/token');
jest.mock('../../../../utils/utils');

describe('tokenDeleteController', async () => {
  let req: any;
  let res: any;
  let next: any;

  const utilsCreateReplyMock = (utils.createReply as jest.Mock);
  const domainDeleteByQueryMock = (domain.tokenDeleteByQuery as jest.Mock);

  beforeEach(() => {

    req = {
      params: {
        addressOrAlias: 'mockedQuery',
      },
    };

    res = {
      send: jest.fn(),
    };

    next = jest.fn();

    utilsCreateReplyMock.mockReset();
    domainDeleteByQueryMock.mockReset();

  });

  it('should call domain.tokenDeleteByQuery and return the response', async () => {

    domainDeleteByQueryMock.mockResolvedValue('mockResult');

    await tokenDeleteController.tokenDeleteByQuery(req, res, next);

    expect(domainDeleteByQueryMock).toHaveBeenCalledTimes(1);
    expect(domainDeleteByQueryMock).toHaveBeenCalledWith('mockedQuery');

    expect(utilsCreateReplyMock).toHaveBeenCalledTimes(1);
    expect(utilsCreateReplyMock).toHaveBeenCalledWith(res);

  });

  it('should call domain.tokenDeleteByQuery and fail if there is a problem', async () => {

    const errThrowed = new Error('Boom!');
    domainDeleteByQueryMock.mockRejectedValue(errThrowed);

    await tokenDeleteController.tokenDeleteByQuery(req, res, next);

    expect(domainDeleteByQueryMock).toHaveBeenCalledTimes(1);
    expect(domainDeleteByQueryMock).toHaveBeenCalledWith('mockedQuery');

    expect(next).toHaveBeenCalledTimes(1);

  });

});
