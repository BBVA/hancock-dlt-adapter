
import 'jest';
import * as db from '../../../../db/ethereum';
import { hancockDbError, hancockNotFoundError } from '../../../../models/error';
import {
  IEthereumContractAbiDbModel,
  IEthereumSmartContractInvokeByQueryRequest,
  IEthereumSmartContractInvokeModel,
} from '../../../../models/ethereum';
import { error } from '../../../../utils/error';
import * as metadataDomain from '../../../ethereum/token/metadata';
import { hancockContractNotFoundError } from '../../models/error';
import { adaptContractInvoke } from '../../smartContract/common';
import { hancockContractAbiError, hancockContractInvokeError } from '../../smartContract/models/error';
import { getAdaptRequestModel } from '../common';
import { hancockContractTokenMetadataError } from '../models/error';

jest.mock('../../../../utils/utils');
jest.mock('../../../../db/ethereum');
jest.mock('../../smartContract/common');
jest.mock('../common.ts');
jest.mock('../../../../utils/logger');
jest.mock('../../../../utils/error');

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

      dbMock.mockResolvedValueOnce(iEthereumContractDbModel);

      adaptMock.mockRejectedValueOnce(hancockContractTokenMetadataError);

      try {

        await metadataDomain.getTokenMetadata(address);
        fail('it should fail');

      } catch (e) {

        expect(adaptMock).toHaveBeenCalledTimes(4);
        expect(error).toHaveBeenCalledWith(hancockContractInvokeError, hancockContractTokenMetadataError);
        expect(e).toEqual(hancockContractInvokeError);

      }

    });

    it('should throw an exception if there are problems retrieving the contractModels (null)', async () => {

      dbMock.mockResolvedValueOnce(null);

      try {

        await metadataDomain.getTokenMetadata(address);
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

        await metadataDomain.getTokenMetadata(address);
        fail('It should fail');

      } catch (e) {

        expect(dbMock).toHaveBeenCalledTimes(1);
        expect(error).toHaveBeenCalledWith(hancockDbError, hancockContractNotFoundError);
        expect(e).toEqual(hancockDbError);

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

      dbSCMock.mockResolvedValueOnce(iEthereumContractDbModelSC);

      (metadataDomain.getTokenMetadata as any).mockRejectedValueOnce(hancockContractTokenMetadataError);

      try {

        await metadataDomain.getTokenMetadataByQuery(addressOrAlias);
        fail('it should fail');

      } catch (e) {

        expect((metadataDomain.getTokenMetadata as any)).toHaveBeenCalledTimes(1);
        expect(error).toHaveBeenCalledWith(hancockContractTokenMetadataError, hancockContractTokenMetadataError);
        expect(e).toEqual(hancockContractTokenMetadataError);

      }

    });

    it('should throw an exception if there are problems retrieving the contractModels (null)', async () => {

      dbSCMock.mockResolvedValueOnce(null);

      try {

        await metadataDomain.getTokenMetadataByQuery(addressOrAlias);
        fail('It should fail');

      } catch (e) {

        expect(dbSCMock).toHaveBeenCalledTimes(1);
        expect(error).toHaveBeenCalledWith(hancockContractNotFoundError);
        expect(e).toEqual(hancockContractNotFoundError);

      }

    });

    it('should throw an exception if there are problems retrieving the contractModels', async () => {

      dbSCMock.mockRejectedValueOnce(hancockDbError);

      try {

        await metadataDomain.getTokenMetadataByQuery(addressOrAlias);
        fail('It should fail');

      } catch (e) {

        expect(dbSCMock).toHaveBeenCalledTimes(1);
        expect(error).toHaveBeenCalledWith(hancockDbError, hancockDbError);
        expect(e).toEqual(hancockDbError);

      }

    });

  });

});
