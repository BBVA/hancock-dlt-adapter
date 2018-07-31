
import 'jest';
import { FindAndModifyWriteOpResultObject } from 'mongodb';
import * as db from '../../../../db/ethereum';
import { hancockDbError } from '../../../../models/error';
import { error } from '../../../../utils/error';
import logger from '../../../../utils/logger';
import { hancockContractNotFoundError } from '../../models/error';
import * as ethereumScDeleteDomain from '../delete';
import { hancockContractDeleteError } from '../models/error';

jest.mock('../../../../db/ethereum');
jest.mock('../../../../utils/logger');
jest.mock('../../../../utils/error');

describe('ethereumScDeleteDomain', () => {

  describe('::deleteByQuery', () => {

    const dbContractMock: jest.Mock = (db.getSmartContractByAddressOrAlias as jest.Mock);
    const dbDeleteInstanceMock: jest.Mock = (db.deleteSmartContractByAddressOrAlias as jest.Mock);
    const dbDeleteAbiMock: jest.Mock = (db.deleteSmartContracAbiByName as jest.Mock);
    const addressOrAlias: string = 'whatever';
    const contractModelMock = {
      abiName: 'mockedAbiName',
    };

    beforeEach(() => {

      jest.clearAllMocks();

    });

    it('should call the db.deleteSmartContractByAddressOrAlias method and return a success response', async () => {

      const expectedInstanceResponse: FindAndModifyWriteOpResultObject = {
        ok: 1,
      };
      const expectedAbiResponse: FindAndModifyWriteOpResultObject = {
        ok: 1,
      };

      dbContractMock.mockResolvedValueOnce(contractModelMock);
      dbDeleteInstanceMock.mockResolvedValueOnce(expectedInstanceResponse);
      dbDeleteAbiMock.mockResolvedValueOnce(expectedAbiResponse);

      await ethereumScDeleteDomain.deleteByQuery(addressOrAlias);

      expect(dbDeleteInstanceMock).toHaveBeenLastCalledWith(addressOrAlias);
      expect(dbDeleteAbiMock).toHaveBeenLastCalledWith(contractModelMock.abiName);
      expect(logger.info).toHaveBeenLastCalledWith('Smart contract de-registered');

    });

    it('should throw an exception if the contract is not found', async () => {

      dbContractMock.mockResolvedValueOnce(null);

      try {

        await ethereumScDeleteDomain.deleteByQuery(addressOrAlias);
        fail('It should fail');

      } catch (err) {

        expect(dbContractMock).toHaveBeenCalledWith(addressOrAlias);
        expect(error).toHaveBeenCalledWith(hancockContractNotFoundError);
        expect(err).toEqual(hancockContractNotFoundError);

      }

    });

    it('should throw an exception if the db.deleteSmartContractByAddressOrAlias returns an invalid response', async () => {

      const expectedInstanceResponse: FindAndModifyWriteOpResultObject = {
        ok: 0,
      };
      dbContractMock.mockResolvedValueOnce(contractModelMock);
      dbDeleteInstanceMock.mockResolvedValueOnce(expectedInstanceResponse);

      try {

        await ethereumScDeleteDomain.deleteByQuery(addressOrAlias);
        fail('It should fail');

      } catch (err) {

        expect(dbDeleteInstanceMock).toHaveBeenLastCalledWith(addressOrAlias);
        expect(error).toHaveBeenCalledWith(hancockContractDeleteError);
        expect(err).toEqual(hancockContractDeleteError);

      }

    });

    it('should throw an exception if there are problems calling the ddbb', async () => {

      dbDeleteInstanceMock.mockRejectedValueOnce(hancockDbError);
      dbContractMock.mockResolvedValueOnce(contractModelMock);

      try {

        await ethereumScDeleteDomain.deleteByQuery(addressOrAlias);
        fail('It should fail');

      } catch (err) {

        expect(dbDeleteInstanceMock).toHaveBeenLastCalledWith(addressOrAlias);
        expect(error).toHaveBeenCalledWith(hancockDbError, hancockDbError);
        expect(err).toEqual(hancockDbError);

      }

    });

  });

});
