import 'jest';
import { error } from '../../../../utils/error';
import * as scDeleteDomain from '../../smartContract/delete';
import * as tokenDeleteDomain from '../delete';
import { hancockContractTokenDeleteError } from '../models/error';

jest.mock('../../smartContract/delete');
jest.mock('../../../../utils/logger');
jest.mock('../../../../utils/error');

describe('tokenDeleteDomain', () => {

  describe('::tokenDeleteByQuery', () => {

    const scDeleteMock: jest.Mock = (scDeleteDomain.deleteByQuery as any);
    const addressOrAlias: string = 'mockedAddressOrAlias';

    beforeEach(() => {

      scDeleteMock.mockReset();

    });

    it('should call the smartContract.deleteByQuery method and delete the token but not the abi', async () => {

      const result = await tokenDeleteDomain.tokenDeleteByQuery(addressOrAlias);

      expect(scDeleteMock).toHaveBeenCalledWith(addressOrAlias, false);
      expect(result).toBeUndefined();

    });

    it('should throw an exception if there are problems deleteing the token', async () => {

      const throwedError: Error = new Error('Boom!');
      scDeleteMock.mockRejectedValueOnce(throwedError);

      try {

        await tokenDeleteDomain.tokenDeleteByQuery(addressOrAlias);
        fail('It should fail');

      } catch (e) {

        expect(scDeleteMock).toHaveBeenCalled();
        expect(error).toHaveBeenCalledWith(hancockContractTokenDeleteError, throwedError);
        expect(e).toEqual(hancockContractTokenDeleteError);

      }

    });

  });

});
