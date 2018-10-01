
import 'jest';
import * as bitcoin from '../../../utils/bitcoin';
import * as getBalanceDomain from '../getBalance';
import { hancockBitcoinBalanceError } from '../models/error';

jest.mock('../../../utils/bitcoin');
jest.mock('../../../utils/error');

describe('getBalanceDomain', () => {

  const address: string = 'mrTv3qiqTco1qHMBcwVjzJDuddDwKLNE4W';
  const getBalanceMock: jest.Mock = (bitcoin as any).__client__.api.getBalance;

  beforeEach(() => {

    getBalanceMock.mockReset();

  });

  it('should retrieve the balance', async () => {

    const response: any = 'whatever';

    getBalanceMock.mockResolvedValue(response);

    const result: any = await getBalanceDomain.getBalance(address);

    expect(getBalanceMock).toHaveBeenCalledWith(address);
    expect(result).toEqual(response);

  });

  it('should fail if there are errors', async () => {

    getBalanceMock.mockRejectedValueOnce(hancockBitcoinBalanceError);

    try {

      await getBalanceDomain.getBalance(address);
      fail('it should fail');

    } catch (e) {

      expect(getBalanceMock).toHaveBeenCalledWith(address);
      expect(e).toEqual(hancockBitcoinBalanceError);

    }

  });

});
