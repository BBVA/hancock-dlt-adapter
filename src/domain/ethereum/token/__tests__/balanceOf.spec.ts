
import 'jest';
import * as db from '../../../../db/ethereum';
import { hancockDbError } from '../../../../models/error';
import { IEthereumSmartContractInvokeModel } from '../../../../models/ethereum';
import { error } from '../../../../utils/error';
import * as balanceOfDomain from '../../../ethereum/token/balanceOf';
import { hancockContractNotFoundError } from '../../models/error';
import { adaptContractInvoke } from '../../smartContract/common';
import { hancockContractAbiError, hancockContractInvokeError } from '../../smartContract/models/error';
import { hancockContractTokenBalanceError } from '../models/error';

jest.mock('../../../../utils/utils');
jest.mock('../../../../db/ethereum');
jest.mock('../../smartContract/common');
jest.mock('../../../../utils/logger');
jest.mock('../../../../utils/error');

describe('balanceOfDomain', () => {

  const dbMock: jest.Mock = (db.getAbiByName as any);
  const address: string = '0xWhatever';
  const addressOrAlias: string = '0xTokenever';
  let iEthereumContractDbModel;
  const invokeMock: jest.Mock = (adaptContractInvoke as any);

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

    const invokeModelBalance: IEthereumSmartContractInvokeModel = {
      abi: [],
      action: 'call',
      from: address,
      method: 'balanceOf',
      params: [address],
      to: addressOrAlias,
    };

    const invokeModelDecimals: IEthereumSmartContractInvokeModel = {
      abi: [],
      action: 'call',
      from: address,
      method: 'decimals',
      params: [],
      to: addressOrAlias,
    };

    invokeMock.mockResolvedValueOnce('mockBalance');
    invokeMock.mockResolvedValueOnce('mockAccuracy');

    getTokenBalanceMock.mockImplementationOnce((addr, callbacks) => {
      callbacks(null, response);
    });

    const result: any = await balanceOfDomain.tokenBalanceOf(addressOrAlias, address);

    expect(dbMock).toHaveBeenCalledTimes(1);
    expect(invokeMock).toHaveBeenCalledWith(invokeModelBalance);
    expect(invokeMock).toHaveBeenCalledWith(invokeModelDecimals);
    expect(result).toEqual(response);

  });

  it('should fail if there are errors', async () => {

    dbMock.mockResolvedValueOnce(iEthereumContractDbModel);

    invokeMock.mockRejectedValueOnce(hancockContractTokenBalanceError);

    try {

      await balanceOfDomain.tokenBalanceOf(addressOrAlias, address);
      fail('it should fail');

    } catch (e) {

      expect(invokeMock).toHaveBeenCalledTimes(2);
      expect(error).toHaveBeenCalledWith(hancockContractInvokeError, hancockContractTokenBalanceError);
      expect(e).toEqual(hancockContractInvokeError);

    }

  });

  it('should throw an exception if there are problems retrieving the contractModels (null)', async () => {

    dbMock.mockResolvedValueOnce(null);

    try {

      await balanceOfDomain.tokenBalanceOf(addressOrAlias, address);
      fail('It should fail');

    } catch (e) {

      expect(dbMock).toHaveBeenCalledTimes(1);
      expect(error).toHaveBeenCalledWith(hancockContractAbiError);
      expect(e).toEqual(hancockContractAbiError);

    }

  });

  it('should throw an exception if there are problems retrieving the contractModels', async () => {

    dbMock.mockRejectedValueOnce(hancockContractNotFoundError);

    try {

      await balanceOfDomain.tokenBalanceOf(addressOrAlias, address);
      fail('It should fail');

    } catch (e) {

      expect(dbMock).toHaveBeenCalledTimes(1);
      expect(error).toHaveBeenCalledWith(hancockDbError, hancockContractNotFoundError);
      expect(e).toEqual(hancockDbError);

    }

  });

});
