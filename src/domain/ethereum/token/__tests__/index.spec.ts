
import 'jest';
import * as tokenDomain from '../../../ethereum/token';
import * as db from '../../../../db/ethereum';

jest.mock('../transfer');
jest.mock('../smartContract');
jest.mock('../token');
jest.mock('../../../utils/utils');

describe('tokenDomain', () => {

  const dbMock: jest.Mock = (db.getAbiByName as any);
  let iEthereumContractDbModel;
  const address: string = '0xWhatever';
  const scAddress: string = '0xTokenever';

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
    dbMock.mockReset();

    iEthereumContractDbModel = {
      abi: [],
      abiName: 'mockAbiName',
      address: 'mockAddress',
      alias: 'mockAlias',
    };

  });

  it('should call the db.getAbiByName method and retrieve the balance of token', async () => {

    const response: any = 'whatever';
    dbMock.mockResolvedValueOnce(iEthereumContractDbModel);

    getBalanceMock.mockImplementationOnce((addr, callbacks) => {
      callbacks(null, response);
    });

    const result: any = await tokenDomain.getTokenBalance(address,scAddress);

    expect(dbMock).toHaveBeenCalledTimes(1);
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

      await tokenDomain.getTokenBalance(address,scAddress);
      fail('it should fail');

    } catch (e) {

      const firstCall = getBalanceMock.mock.calls[0];
      expect(firstCall[0]).toEqual(address);
      expect(e).toEqual(throwedError);

    }

  });

});