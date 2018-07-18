
import 'jest';
import * as db from '../../../../db/ethereum';
import { IEthereumSmartContractInvokeByQueryRequest } from '../../../../models/ethereum';
import * as tokenDomain from '../../../ethereum/token';
import { invokeByQuery } from '../../smartContract/invoke';

jest.mock('../../../../utils/utils');
jest.mock('../../../../db/ethereum');
jest.mock('../../smartContract/invoke');

describe('tokenDomain', () => {

  const dbMock: jest.Mock = (db.getSmartContractByAddressOrAlias as any);
  const address: string = '0xWhatever';
  const addressOrAlias: string = '0xTokenever';
  let iEthereumContractDbModel;
  const invokeMock: jest.Mock = (invokeByQuery as any);

  const getTokenBalanceMock: jest.Mock = jest.fn();
  const contractMock: jest.Mock = jest.fn().mockReturnValue({
    balanceOf: getTokenBalanceMock,
  });

  beforeEach(() => {

    getTokenBalanceMock.mockReset();
    dbMock.mockReset();
    invokeMock.mockReset();

    iEthereumContractDbModel = {
      abi: [],
      abiName: 'mockAbiName',
      address: 'mockAddress',
      alias: 'mockAlias',
    };

  });

  it('should call the db.getSmartContractByAddressOrAlias method and retrieve the balance of token', async () => {

    const response = {accuracy: 'mockAccuracy', balance: 'mockBalance'};
    dbMock.mockResolvedValueOnce(iEthereumContractDbModel);

    const invokeModel: IEthereumSmartContractInvokeByQueryRequest = {
      action: 'call',
      from: 'mockAddress',
      method: 'balanceOf',
      params: ['0xWhatever'],
    };

    const invokeModelb: IEthereumSmartContractInvokeByQueryRequest = {
      action: 'call',
      from: 'mockAddress',
      method: 'decimals',
      params: [],
    };

    invokeMock.mockResolvedValueOnce('mockBalance');
    invokeMock.mockResolvedValueOnce('mockAccuracy');

    getTokenBalanceMock.mockImplementationOnce((addr, callbacks) => {
      callbacks(null, response);
    });

    const result: any = await tokenDomain.getTokenBalance(addressOrAlias, address);

    expect(dbMock).toHaveBeenCalledTimes(1);
    expect(invokeMock).toHaveBeenCalledWith(addressOrAlias, invokeModel);
    expect(invokeMock).toHaveBeenCalledWith(addressOrAlias, invokeModelb);
    expect(result).toEqual(response);

  });

  it('should fail if there are errors', async () => {

    const throwedError = new Error('Boom!');

    dbMock.mockResolvedValueOnce(iEthereumContractDbModel);

    invokeMock.mockRejectedValueOnce(throwedError);

    try {

      await tokenDomain.getTokenBalance(addressOrAlias, address);
      fail('it should fail');

    } catch (e) {

      expect(invokeMock).toHaveBeenCalledTimes(1);
      expect(e).toEqual(throwedError);

    }

  });

  it('should throw an exception if there are problems retrieving the contractModels', async () => {

    const throwedError: Error = new Error('Boom!');
    dbMock.mockRejectedValueOnce(throwedError);

    try {

      await tokenDomain.getTokenBalance(addressOrAlias, address);
      fail('It should fail');

    } catch (e) {

      expect(dbMock).toHaveBeenCalledTimes(1);
      expect(e).toEqual(throwedError);

    }

  });

});