
import 'jest';
import { FindAndModifyWriteOpResultObject } from 'mongodb';
import * as db from '../../../../db/ethereum';
import {
  ethereumSmartContractInternalServerErrorResponse,
} from '../../../../models/ethereum';
import * as ethereumScDeleteDomain from '../delete';

jest.mock('../../../../db/ethereum');

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

      jest.resetAllMocks();

      dbContractMock.mockResolvedValue(contractModelMock);

    });

    it('should call the db.deleteSmartContractByAddressOrAlias method and return a success response', async () => {

      const expectedInstanceResponse: FindAndModifyWriteOpResultObject = {
        ok: 1,
      };
      const expectedAbiResponse: FindAndModifyWriteOpResultObject = {
        ok: 1,
      };

      dbDeleteInstanceMock.mockResolvedValueOnce(expectedInstanceResponse);
      dbDeleteAbiMock.mockResolvedValueOnce(expectedAbiResponse);

      await ethereumScDeleteDomain.deleteByQuery(addressOrAlias);

      expect(dbDeleteInstanceMock).toHaveBeenLastCalledWith(addressOrAlias);
      expect(dbDeleteAbiMock).toHaveBeenLastCalledWith(contractModelMock.abiName);
      expect(LOG.info).toHaveBeenLastCalledWith('Smart contract de-registered');

    });

    it('should throw an exception if the contract is not found', async () => {

      dbContractMock.mockResolvedValue(null);

      try {

        await ethereumScDeleteDomain.deleteByQuery(addressOrAlias);
        fail('It should fail');

      } catch (e) {

        expect(dbContractMock).toHaveBeenCalledWith(addressOrAlias);
        expect(e).toEqual(ethereumSmartContractInternalServerErrorResponse);

      }

    });

    it('should throw an exception if the db.deleteSmartContractByAddressOrAlias returns an invalid response', async () => {

      const expectedInstanceResponse: FindAndModifyWriteOpResultObject = {
        ok: 0,
      };

      dbDeleteInstanceMock.mockResolvedValueOnce(expectedInstanceResponse);

      try {

        await ethereumScDeleteDomain.deleteByQuery(addressOrAlias);
        fail('It should fail');

      } catch (e) {

        expect(dbDeleteInstanceMock).toHaveBeenLastCalledWith(addressOrAlias);
        expect(e).toEqual(ethereumSmartContractInternalServerErrorResponse);

      }

    });

    it('should throw an exception if there are problems calling the ddbb', async () => {

      dbDeleteInstanceMock.mockRejectedValueOnce(new Error('Boom!'));

      try {

        await ethereumScDeleteDomain.deleteByQuery(addressOrAlias);
        fail('It should fail');

      } catch (e) {

        expect(dbDeleteInstanceMock).toHaveBeenLastCalledWith(addressOrAlias);
        expect(e).toEqual(ethereumSmartContractInternalServerErrorResponse);

      }

    });

  });

});
