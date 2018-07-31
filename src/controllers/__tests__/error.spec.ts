
import 'jest';
import { HancockError, IHancockErrorResponse } from '../../models/error';
import logger from '../../utils/logger';
import { _getErrorResponse, errorController } from '../error';

jest.mock('../../utils/logger');

describe('errorController', async () => {

  global.console = {
    error: jest.fn(),
    log: jest.fn(),
  } as any;

  let req: any;
  let res: any;
  let next: any;
  let testError: HancockError;

  beforeEach(() => {

    testError = new HancockError('12345', 123, 'Test Error Suite');

    req = {};

    res = {
      json: jest.fn(),
      status: jest.fn().mockImplementation(() => res),
    };

    next = jest.fn();

  });

  it('should return the HancockError correctly', async () => {

    const expectedResponse = {
      error: 123,
      internalError: 'HKAD12345',
      message: 'Test Error Suite',
    };

    const response: IHancockErrorResponse = _getErrorResponse(testError);

    expect(response).toEqual(expectedResponse);

  });

  it('should return the HancockError correctly with extendedMessage', async () => {

    const expectedResponse = {
      error: 123,
      internalError: 'HKAD12345',
      message: 'Test Error Suite',
      extendedMessage: 'testExtender',
    };

    const response: IHancockErrorResponse = _getErrorResponse({...testError, extendedMessage: 'testExtender'});

    expect(response).toEqual(expectedResponse);

  });

  it('should return the correct status code and error body given an specific error', async () => {

    (_getErrorResponse as any) = jest.fn();
    await errorController(testError, req, res, next);

    expect(res.status.mock.calls).toEqual([[testError.httpCode]]);
    expect(_getErrorResponse).toHaveBeenCalledWith(testError);
    expect(logger.error).toHaveBeenCalledWith(testError);

  });

});
