
import 'jest';
import * as tokenDomain from '../../../ethereum/token';
import * as db from '../../../../db/ethereum';

//jest.mock('../../token');
jest.mock('../../../../utils/utils');
jest.mock('../../../../db/ethereum');

describe('tokenDomain', () => {

  const dbMock: jest.Mock = (db.getSmartContractByAddressOrAlias as any);
  const address: string = '0xWhatever';
  const addressOrAlias: string = '0xTokenever';
  let iEthereumContractDbModel;

  const getTokenBalanceMock: jest.Mock = jest.fn();
  const contractMock: jest.Mock = jest.fn().mockReturnValue({
    balanceOf: getTokenBalanceMock,
  });

  global.ETH = {
    web3: {
      eth: {
        contract: contractMock,
      },
    },
  };

  beforeEach(() => {

    getTokenBalanceMock.mockReset();
    dbMock.mockReset();

    iEthereumContractDbModel = {
      abi: [],
      abiName: 'mockAbiName',
      address: 'mockAddress',
      alias: 'mockAlias',
    };

  });

  it('should call the db.getSmartContractByAddressOrAlias method and retrieve the balance of token', async () => {

    const response: any = 'whatever';
    dbMock.mockResolvedValueOnce(iEthereumContractDbModel);

    getTokenBalanceMock.mockImplementationOnce((addr, callbacks) => {
      callbacks(null, response);
    });

    const result: any = await tokenDomain.getTokenBalance(address,addressOrAlias);

    expect(dbMock).toHaveBeenCalledTimes(1);
    const firstCall = getTokenBalanceMock.mock.calls[0];
    expect(firstCall[0]).toEqual(address);
    expect(result).toEqual(response);

  });

  it('should fail if there are errors', async () => {

    const throwedError = new Error('Boom!');

    dbMock.mockResolvedValueOnce(iEthereumContractDbModel);

    getTokenBalanceMock.mockImplementationOnce((addr, callbacks) => {
      callbacks(throwedError, undefined);
    });

    try {

      await tokenDomain.getTokenBalance(address,addressOrAlias);
      fail('it should fail');

    } catch (e) {
      
      const firstCall = getTokenBalanceMock.mock.calls[0];
      expect(firstCall[0]).toEqual(address);
      expect(e).toEqual(throwedError);

    }

  });

});