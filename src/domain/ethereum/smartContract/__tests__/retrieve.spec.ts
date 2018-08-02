import 'jest';
import * as db from '../../../../db/ethereum';
import { hancockDbError } from '../../../../models/error';
import {
  ethereumSmartContractInternalServerErrorResponse,
  IEthereumContractDbModel,
} from '../../../../models/ethereum';
import { error } from '../../../../utils/error';
import * as ethereumScCommonDomain from '../common';
import { hancockContractRetrieveError } from '../models/error';
import * as ethereumScRetrieveDomain from '../retrieve';

jest.mock('../common');
jest.mock('../../../../db/ethereum');
jest.mock('../../../../utils/logger');
jest.mock('../../../../utils/error');

describe('ethereumScRetrieveDomain', () => {

  describe('::find', () => {

    const dbMock: jest.Mock = (db.getAllSmartContracts as any);

    beforeEach(() => {

      dbMock.mockReset();

    });

    it('should call the db.getAllSmartContracts method and return a list of contractModels', async () => {

      const expectedResponse: IEthereumContractDbModel[] = [] as any;
      dbMock.mockResolvedValueOnce(expectedResponse);

      const result: IEthereumContractDbModel[] = await ethereumScRetrieveDomain.find();

      expect(dbMock).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedResponse);

    });

    it('should throw an exception if there are problems retrieving the contractModels', async () => {

      dbMock.mockRejectedValueOnce(hancockContractRetrieveError);

      try {

        await ethereumScRetrieveDomain.find();
        fail('It should fail');

      } catch (e) {

        expect(dbMock).toHaveBeenCalledTimes(1);
        expect(e).toEqual(hancockDbError);

      }

    });

  });

  describe('::findOne', () => {

    const retrieveContractAbiByAddressOrAliasMock: jest.Mock = (ethereumScCommonDomain.retrieveContractAbiByAddressOrAlias as any);

    beforeEach(() => {

      retrieveContractAbiByAddressOrAliasMock.mockReset();

    });

    it('should call the common.retrieveContractAbiByAddressOrAlias method and return a the contractModel', async () => {

      const addressOrAlias: string = 'addressOrAlias';
      const contractModelResponseMock: IEthereumContractDbModel = {} as any;

      retrieveContractAbiByAddressOrAliasMock.mockResolvedValue(contractModelResponseMock);

      const result: any = await ethereumScRetrieveDomain.findOne(addressOrAlias);

      expect(retrieveContractAbiByAddressOrAliasMock).toHaveBeenCalledWith(addressOrAlias);
      expect(result).toEqual(contractModelResponseMock);

    });

    it('should throw an exception if there are problems retrieving the contractModel', async () => {

      const addressOrAlias: string = 'addressOrAlias';

      retrieveContractAbiByAddressOrAliasMock.mockRejectedValueOnce(hancockContractRetrieveError);

      try {

        await ethereumScRetrieveDomain.findOne(addressOrAlias);
        fail('It should fail');

      } catch (e) {

        expect(retrieveContractAbiByAddressOrAliasMock).toHaveBeenCalledWith(addressOrAlias);
        expect(e).toEqual(hancockContractRetrieveError);

      }

    });

  });

});
