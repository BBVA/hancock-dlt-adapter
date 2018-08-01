
import 'jest';
import * as db from '../../../../db/ethereum';
import { hancockDbError } from '../../../../models/error';
import { IEthereumSmartContractInvokeByQueryRequest } from '../../../../models/ethereum';
import { error } from '../../../../utils/error';
import * as tokenDomain from '../../../ethereum/token';
import { hancockContractNotFoundError } from '../../models/error';
import { invokeByQuery } from '../../smartContract/invoke';
import { hancockContractInvokeError } from '../../smartContract/models/error';
import { hancockContractTokenBalanceError } from '../models/error';

jest.mock('../../../../utils/utils');
jest.mock('../../../../db/ethereum');
jest.mock('../../smartContract/invoke');
jest.mock('../../../../utils/logger');
jest.mock('../../../../utils/error');

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

    dbMock.mockResolvedValueOnce(iEthereumContractDbModel);

    invokeMock.mockRejectedValueOnce(hancockContractTokenBalanceError);

    try {

      await tokenDomain.getTokenBalance(addressOrAlias, address);
      fail('it should fail');

    } catch (e) {

      expect(invokeMock).toHaveBeenCalledTimes(1);
      expect(error).toHaveBeenCalledWith(hancockContractInvokeError, hancockContractTokenBalanceError);
      expect(e).toEqual(hancockContractInvokeError);

    }

  });

  it('should throw an exception if there are problems retrieving the contractModels (null)', async () => {

    dbMock.mockResolvedValueOnce(null);

    try {

      await tokenDomain.getTokenBalance(addressOrAlias, address);
      fail('It should fail');

    } catch (e) {

      expect(dbMock).toHaveBeenCalledTimes(1);
      expect(error).toHaveBeenCalledWith(hancockContractNotFoundError);
      expect(e).toEqual(hancockContractNotFoundError);

    }

  });

  it('should throw an exception if there are problems retrieving the contractModels', async () => {

    dbMock.mockRejectedValueOnce(hancockContractNotFoundError);

    try {

      await tokenDomain.getTokenBalance(addressOrAlias, address);
      fail('It should fail');

    } catch (e) {

      expect(dbMock).toHaveBeenCalledTimes(1);
      expect(error).toHaveBeenCalledWith(hancockDbError, hancockContractNotFoundError);
      expect(e).toEqual(hancockDbError);

    }

  });

});
