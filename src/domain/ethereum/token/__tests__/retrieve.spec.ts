import 'jest';
import * as db from '../../../../db/ethereum';
import { hancockDbError } from '../../../../models/error';
import {
  IEthereumContractDbModel,
  IEthereumContractInstanceDbModel,
} from '../../../../models/ethereum';
import { error } from '../../../../utils/error';
import { hancockContractTokenRetrieveError } from '../models/error';
import * as ethereumTokenRetrieveDomain from '../retrieve';

jest.mock('../../../../db/ethereum');
jest.mock('../../../../utils/logger');
jest.mock('../../../../utils/error');

describe('ethereumTokenRetrieveDomain', () => {

  describe('::find', () => {

    const dbMock: jest.Mock = (db.getInstancesByAbi as any);

    beforeEach(() => {

      dbMock.mockReset();

    });

    it('should call the db.getInstancesByAbi method and return a list of contractModels', async () => {

      const expectedResponse: IEthereumContractInstanceDbModel[] = [] as any;
      dbMock.mockResolvedValueOnce(expectedResponse);

      const result: IEthereumContractInstanceDbModel[] = await ethereumTokenRetrieveDomain.tokenFindAll();

      expect(dbMock).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedResponse);

    });

    it('should throw an exception if there are problems retrieving the contractModels', async () => {

      dbMock.mockRejectedValueOnce(hancockContractTokenRetrieveError);

      try {

        await ethereumTokenRetrieveDomain.tokenFindAll();
        fail('It should fail');

      } catch (e) {

        expect(dbMock).toHaveBeenCalledTimes(1);
        expect(e).toEqual(hancockDbError);

      }

    });

  });

});
