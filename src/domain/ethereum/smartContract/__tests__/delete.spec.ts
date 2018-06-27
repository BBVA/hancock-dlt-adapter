
import 'jest';
import { FindAndModifyWriteOpResultObject } from 'mongodb';
import * as db from '../../../../db/ethereum';
import {
  EthereumSmartContractInternalServerErrorResponse,
} from '../../../../models/ethereum';
import * as ethereumScDeleteDomain from '../delete';

jest.mock('../../../../db/ethereum');

describe('ethereumScDeleteDomain', () => {

  describe('::deleteByQuery', () => {

    const dbMock: jest.Mock = (db.deleteSmartContractByAddressOrAlias as jest.Mock);

    beforeEach(() => {

      dbMock.mockReset();

    });

    it('should call the db.deleteSmartContractByAddressOrAlias method and return a success response', async () => {

      const addressOrAlias: string = 'whatever';
      const expectedResponse: FindAndModifyWriteOpResultObject = {
        ok: 1,
      };

      dbMock.mockResolvedValueOnce(expectedResponse);

      await ethereumScDeleteDomain.deleteByQuery(addressOrAlias);
      expect(dbMock).toHaveBeenLastCalledWith(addressOrAlias);
      expect(LOG.info).toHaveBeenLastCalledWith('Smart contract de-registered');

    });

    it('should throw an exception if the db.deleteSmartContractByAddressOrAlias returns an invalid response', async () => {

      const addressOrAlias: string = 'whatever';
      const expectedResponse: FindAndModifyWriteOpResultObject = {
        ok: 0,
      };

      dbMock.mockResolvedValueOnce(expectedResponse);

      try {

        await ethereumScDeleteDomain.deleteByQuery(addressOrAlias);
        fail('It should fail');

      } catch (e) {

        expect(dbMock).toHaveBeenLastCalledWith(addressOrAlias);
        expect(e).toEqual(EthereumSmartContractInternalServerErrorResponse);

      }

    });

    it('should throw an exception if there are problems calling the ddbb', async () => {

      const addressOrAlias: string = 'whatever';

      dbMock.mockRejectedValueOnce(new Error('Boom!'));

      try {

        await ethereumScDeleteDomain.deleteByQuery(addressOrAlias);
        fail('It should fail');

      } catch (e) {

        expect(dbMock).toHaveBeenLastCalledWith(addressOrAlias);
        expect(e).toEqual(EthereumSmartContractInternalServerErrorResponse);

      }

    });

  });

});
