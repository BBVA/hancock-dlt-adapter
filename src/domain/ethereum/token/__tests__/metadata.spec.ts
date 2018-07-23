
import 'jest';
import * as db from '../../../../db/ethereum';
import {
  IEthereumContractAbiDbModel,
  IEthereumSmartContractInvokeByQueryRequest,
  IEthereumSmartContractInvokeModel,
} from '../../../../models/ethereum';
import * as metadataDomain from '../../../ethereum/token/metadata';
import { adaptContractInvoke } from '../../smartContract/common';
import { getAdaptRequestModel } from '../common';

jest.mock('../../../../utils/utils');
jest.mock('../../../../db/ethereum');
jest.mock('../../smartContract/common');
jest.mock('../common.ts');

describe('metadataDomain', () => {

  const dbMock: jest.Mock = (db.getAbiByName as any);
  const dbSCMock: jest.Mock = (db.getSmartContractByAddressOrAlias as any);
  const addressOrAlias: string = 'myToken';
  const address: string = 'mockedAddress';
  let iEthereumContractDbModel: IEthereumContractAbiDbModel;
  let iEthereumContractDbModelSC;
  const adaptMock: jest.Mock = (adaptContractInvoke as any);
  const getRequestModelMock: jest.Mock = (getAdaptRequestModel as any);

  describe('getTokenMetadata', () => {

    beforeEach(() => {

      dbMock.mockReset();
      adaptMock.mockReset();
      getRequestModelMock.mockReset();

      iEthereumContractDbModel = {
        abi: [],
        name: 'mockName',
      };

    });

    it('should call the db.getAbiByName method and retrieve the metadata of token', async () => {

      const response = {
        decimals: 10,
        name: 'mockName',
        symbol: 'mockSymbol',
        totalSupply: 1000,
      };
      dbMock.mockResolvedValueOnce(iEthereumContractDbModel);

      const invokeModelName: IEthereumSmartContractInvokeModel = {
        abi: [],
        action: 'call',
        from: 'mockAddress',
        method: 'name',
        params: [],
        to: 'mockAddressTo',
      };

      const invokeModelSymbol: IEthereumSmartContractInvokeModel = {
        abi: [],
        action: 'call',
        from: 'mockAddress',
        method: 'symbol',
        params: [],
        to: 'mockAddressTo',
      };

      const invokeModelDecimals: IEthereumSmartContractInvokeModel = {
        abi: [],
        action: 'call',
        from: 'mockAddress',
        method: 'decimals',
        params: [],
        to: 'mockAddressTo',
      };

      const invokeModelTotalSupply: IEthereumSmartContractInvokeModel = {
        abi: [],
        action: 'call',
        from: 'mockAddress',
        method: 'totalSupply',
        params: [],
        to: 'mockAddressTo',
      };

      getRequestModelMock.mockReturnValueOnce(invokeModelName)
      .mockReturnValueOnce(invokeModelSymbol)
      .mockReturnValueOnce(invokeModelDecimals)
      .mockReturnValueOnce(invokeModelTotalSupply);

      adaptMock.mockResolvedValueOnce('mockName')
      .mockResolvedValueOnce('mockSymbol')
      .mockResolvedValueOnce(10)
      .mockResolvedValueOnce(1000);

      const result: any = await metadataDomain.getTokenMetadata(address);

      expect(dbMock).toHaveBeenCalledTimes(1);
      expect(adaptMock).toHaveBeenNthCalledWith(1, invokeModelName);
      expect(adaptMock).toHaveBeenNthCalledWith(2, invokeModelSymbol);
      expect(adaptMock).toHaveBeenNthCalledWith(3, invokeModelDecimals);
      expect(adaptMock).toHaveBeenNthCalledWith(4, invokeModelTotalSupply);
      expect(result).toEqual(response);

    });

    it('should fail if there are errors', async () => {

      const throwedError = new Error('Boom!');

      dbMock.mockResolvedValueOnce(iEthereumContractDbModel);

      adaptMock.mockRejectedValueOnce(throwedError);

      try {

        await metadataDomain.getTokenMetadata(address);
        fail('it should fail');

      } catch (e) {

        expect(adaptMock).toHaveBeenCalledTimes(4);
        expect(e).toEqual(throwedError);

      }

    });

    it('should throw an exception if there are problems retrieving the contractModels', async () => {

      const throwedError: Error = new Error('Boom!');
      dbMock.mockRejectedValueOnce(throwedError);

      try {

        await metadataDomain.getTokenMetadata(address);
        fail('It should fail');

      } catch (e) {

        expect(dbMock).toHaveBeenCalledTimes(1);
        expect(e).toEqual(throwedError);

      }

    });

  });

  describe('getTokenMetadataByQuery', () => {

    const getTokenMock = jest.spyOn(metadataDomain, 'getTokenMetadata');

    beforeEach(() => {

      dbSCMock.mockReset();
      (metadataDomain.getTokenMetadata as any).mockReset();

      iEthereumContractDbModelSC = {
        abi: [],
        abiName: 'mockAbiName',
        address: 'mockAddress',
        alias: 'mockAlias',
      };

    });

    afterAll(() => {
      getTokenMock.mockRestore();
    });

    it('should call the db.getSmartContractByAddressOrAlias method and retrieve the metadata of token', async () => {

      const response = {
        decimals: 10,
        name: 'mockName',
        symbol: 'mockSymbol',
        totalSupply: 1000,
      };
      dbSCMock.mockResolvedValueOnce(iEthereumContractDbModelSC);
      (metadataDomain.getTokenMetadata as any).mockResolvedValueOnce(response);

      const result: any = await metadataDomain.getTokenMetadataByQuery(addressOrAlias);

      expect(dbSCMock).toHaveBeenCalledTimes(1);
      expect(result).toEqual(response);

    });

    it('should fail if there are errors', async () => {

      const throwedError = new Error('Boom!');

      dbSCMock.mockResolvedValueOnce(iEthereumContractDbModelSC);

      (metadataDomain.getTokenMetadata as any).mockRejectedValueOnce(throwedError);

      try {

        await metadataDomain.getTokenMetadataByQuery(addressOrAlias);
        fail('it should fail');

      } catch (e) {

        expect((metadataDomain.getTokenMetadata as any)).toHaveBeenCalledTimes(1);
        expect(e).toEqual(throwedError);

      }

    });

    it('should throw an exception if there are problems retrieving the contractModels', async () => {

      const throwedError: Error = new Error('Boom!');
      dbSCMock.mockRejectedValueOnce(throwedError);

      try {

        await metadataDomain.getTokenMetadataByQuery(addressOrAlias);
        fail('It should fail');

      } catch (e) {

        expect(dbSCMock).toHaveBeenCalledTimes(1);
        expect(e).toEqual(throwedError);

      }

    });

  });

});
