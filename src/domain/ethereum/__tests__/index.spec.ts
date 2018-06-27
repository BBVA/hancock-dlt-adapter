
import 'jest';
import * as ethereumDomain from '../../ethereum';

jest.mock('../transfer');
jest.mock('../smartContract');
jest.mock('../../../utils/utils');

describe('ethereumDomain', () => {

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

    getBalanceMock.mockImplementationOnce((addr, callbacks) => {
      callbacks(null, response);
    });

    const result: any = await ethereumDomain.getBalance(address);

    const firstCall = getBalanceMock.mock.calls[0];
    expect(firstCall[0]).toEqual(address);
    expect(result).toEqual(response);

  });

  it('should fail if there are errors', async () => {

    const throwedError = new Error('Boom!');

    getBalanceMock.mockImplementationOnce((addr, callbacks) => {
      callbacks(throwedError, undefined);
    });

    try {

      await ethereumDomain.getBalance(address);
      fail('it should fail');

    } catch (e) {

      const firstCall = getBalanceMock.mock.calls[0];
      expect(firstCall[0]).toEqual(address);
      expect(e).toEqual(throwedError);

    }

  });

});
