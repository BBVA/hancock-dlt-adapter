
import 'jest';
import { HancockError } from '../../models/error';
import { errorController } from '../error';

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

    console.log(HancockError);
    testError = new HancockError('12345', 123, 'Test Error Suite');

    req = {};

    res = {
      json: jest.fn(),
      status: jest.fn().mockImplementation(() => res),
    };

    next = jest.fn();

  });

  it('should return the correct status code and error body given an specific error', async () => {

    await errorController(testError, req, res, next);

    expect(res.status.mock.calls).toEqual([[testError.httpCode]]);
    expect(res.json.mock.calls).toEqual([[testError]]);
    expect(console.error).toHaveBeenNthCalledWith(1, testError.message, testError.extendedMessage);

  });

});
