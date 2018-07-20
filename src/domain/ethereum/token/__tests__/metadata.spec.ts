
import 'jest';
import * as db from '../../../../db/ethereum';
import { IEthereumSmartContractInvokeByQueryRequest } from '../../../../models/ethereum';
import * as metadataDomain from '../../../ethereum/token';
import { invokeByQuery } from '../../smartContract/invoke';
import { getRequestModel } from '../common';

jest.mock('../../../../utils/utils');
jest.mock('../../../../db/ethereum');
jest.mock('../../smartContract/invoke');
jest.mock('../common.ts');

describe('metadataDomain', () => {

  const dbMock: jest.Mock = (db.getSmartContractByAddressOrAlias as any);
  const addressOrAlias: string = 'myToken';
  let iEthereumContractDbModel;
  const invokeMock: jest.Mock = (invokeByQuery as any);
  const getRequestModelMock: jest.Mock = (getRequestModel as any);

  beforeEach(() => {

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

    const response = {
      decimals: 10,
      name: 'mockName',
      symbol: 'mockSymbol',
      totalSupply: 1000,
    };
    dbMock.mockResolvedValueOnce(iEthereumContractDbModel);

    const invokeModelName: IEthereumSmartContractInvokeByQueryRequest = {
      action: 'call',
      from: 'mockAddress',
      method: 'name',
      params: [],
    };

    const invokeModelSymbol: IEthereumSmartContractInvokeByQueryRequest = {
      action: 'call',
      from: 'mockAddress',
      method: 'symbol',
      params: [],
    };

    const invokeModelDecimals: IEthereumSmartContractInvokeByQueryRequest = {
      action: 'call',
      from: 'mockAddress',
      method: 'decimals',
      params: [],
    };

    const invokeModelTotalSupply: IEthereumSmartContractInvokeByQueryRequest = {
      action: 'call',
      from: 'mockAddress',
      method: 'totalSupply',
      params: [],
    };

    getRequestModelMock.mockReturnValueOnce(invokeModelName)
    .mockReturnValueOnce(invokeModelSymbol)
    .mockReturnValueOnce(invokeModelDecimals)
    .mockReturnValueOnce(invokeModelTotalSupply);

    invokeMock.mockResolvedValueOnce('mockName')
    .mockResolvedValueOnce('mockSymbol')
    .mockResolvedValueOnce(10)
    .mockResolvedValueOnce(1000);

    const result: any = await metadataDomain.getTokenMetadata(addressOrAlias);

    expect(dbMock).toHaveBeenCalledTimes(1);
    expect(invokeMock).toHaveBeenNthCalledWith(1, addressOrAlias, invokeModelName);
    expect(invokeMock).toHaveBeenNthCalledWith(2, addressOrAlias, invokeModelSymbol);
    expect(invokeMock).toHaveBeenNthCalledWith(3, addressOrAlias, invokeModelDecimals);
    expect(invokeMock).toHaveBeenNthCalledWith(4, addressOrAlias, invokeModelTotalSupply);
    expect(result).toEqual(response);

  });

  it('should fail if there are errors', async () => {

    const throwedError = new Error('Boom!');

    dbMock.mockResolvedValueOnce(iEthereumContractDbModel);

    invokeMock.mockRejectedValueOnce(throwedError);

    try {

      await metadataDomain.getTokenMetadata(addressOrAlias);
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

      await metadataDomain.getTokenMetadata(addressOrAlias);
      fail('It should fail');

    } catch (e) {

      expect(dbMock).toHaveBeenCalledTimes(1);
      expect(e).toEqual(throwedError);

    }

  });

});
