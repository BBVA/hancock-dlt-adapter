
import 'jest';
import * as domain from '../../../../domain/ethereum';
import * as utils from '../../../../utils/utils';
import * as ethereumScDeleteController from '../index';

jest.mock('../../../../domain/ethereum');
jest.mock('../../../../utils/utils');

describe('ethereumScDeleteController', async () => {
  let req: any;
  let res: any;
  let next: any;

  const utilsCreateReplyMock = (utils.createReply as jest.Mock);
  const domaindeleteByQueryMock = (domain.deleteByQuery as jest.Mock);

  beforeEach(() => {

    req = {
      params: {
        query: 'mockedQuery',
      },
    };

    res = {
      send: jest.fn(),
    };

    next = jest.fn();

    utilsCreateReplyMock.mockReset();
    domaindeleteByQueryMock.mockReset();

  });

  it('should call domain.deleteByQuery and return the response', async () => {

    domaindeleteByQueryMock.mockResolvedValue('mockResult');

    await ethereumScDeleteController.deleteByQuery(req, res, next);

    expect(domaindeleteByQueryMock).toHaveBeenCalledTimes(1);
    expect(domaindeleteByQueryMock).toHaveBeenCalledWith('mockedQuery');

    expect(utilsCreateReplyMock).toHaveBeenCalledTimes(1);
    expect(utilsCreateReplyMock).toHaveBeenCalledWith(res);

  });

  it('should call domain.deleteByQuery and fail if there is a problem', async () => {

    const errThrowed = new Error('Boom!');
    domaindeleteByQueryMock.mockRejectedValue(errThrowed);

    await ethereumScDeleteController.deleteByQuery(req, res, next);

    expect(domaindeleteByQueryMock).toHaveBeenCalledTimes(1);
    expect(domaindeleteByQueryMock).toHaveBeenCalledWith('mockedQuery');

    expect(next).toHaveBeenCalledTimes(1);

  });

});
