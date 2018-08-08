
import 'jest';
import * as getBalanceDomain from '../getBalance';
import { hancockEthereumBalanceError } from '../models/error';

jest.mock('../transfer');
jest.mock('../smartContract');
jest.mock('../token');
jest.mock('../../../utils/utils');
jest.mock('../../../utils/error');

describe('getBalanceDomain', () => {

  const address: string = '0xWhatever';

  const getBalanceMock: jest.Mock = jest.fn();

  global.ETH = {
    web3: {
      eth: {
        getBalance: getBalanceMock,
      },
    },
  };

  beforeEach(() => {

    getBalanceMock.mockReset();

  });

  it('should retrieve the balance', async () => {

    const response: any = 'whatever';

    getBalanceMock.mockResolvedValue(response);

    const result: any = await getBalanceDomain.getBalance(address);

    const firstCall = getBalanceMock.mock.calls[0];
    expect(firstCall[0]).toEqual(address);
    expect(result).toEqual(response);

  });

  it('should fail if there are errors', async () => {

    getBalanceMock.mockRejectedValueOnce(hancockEthereumBalanceError);

    try {

      await getBalanceDomain.getBalance(address);
      fail('it should fail');

    } catch (e) {

      const firstCall = getBalanceMock.mock.calls[0];
      expect(firstCall[0]).toEqual(address);
      expect(e).toEqual(hancockEthereumBalanceError);

    }

  });

});
