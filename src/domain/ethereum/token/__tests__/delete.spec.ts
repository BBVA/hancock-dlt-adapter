import 'jest';
import * as db from '../../../../db/ethereum';
import { hancockDbError } from '../../../../models/error';
import { TokenNames } from '../../../../models/ethereum';
import { error } from '../../../../utils/error';
import { hancockContractNotFoundError } from '../../models/error';
import * as scDeleteDomain from '../../smartContract/delete';
import * as tokenDeleteDomain from '../delete';
import { hancockContractTokenDeleteError } from '../models/error';

jest.mock('../../smartContract/delete');
jest.mock('../../../../db/ethereum');
jest.mock('../../../../utils/logger');
jest.mock('../../../../utils/error');

describe('tokenDeleteDomain', () => {

  describe('::tokenDeleteByQuery', () => {

    const scDeleteMock: jest.Mock = (scDeleteDomain.deleteByQuery as any);
    const getSmartContractByAddressOrAliasMock: jest.Mock = (db.getSmartContractByAddressOrAlias as any);
    const addressOrAlias: string = 'mockedAddressOrAlias';

    const successContractModelMock = {
      abiName: TokenNames.ERC20,
    };

    beforeEach(() => {

      scDeleteMock.mockReset();
      getSmartContractByAddressOrAliasMock.mockReset();

    });

    it('should call the smartContract.deleteByQuery method and delete the token but not the abi', async () => {

      getSmartContractByAddressOrAliasMock.mockResolvedValueOnce(successContractModelMock);

      const result = await tokenDeleteDomain.tokenDeleteByQuery(addressOrAlias);

      expect(scDeleteMock).toHaveBeenCalledWith(addressOrAlias, false);
      expect(result).toBeUndefined();

    });

    it('should throw an exception if there are problems deleting the token', async () => {

      getSmartContractByAddressOrAliasMock.mockResolvedValueOnce(successContractModelMock);

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

    it('should throw an exception if there are problems deleting the token (null contractModel)', async () => {

      getSmartContractByAddressOrAliasMock.mockResolvedValueOnce(null);

      try {

        await tokenDeleteDomain.tokenDeleteByQuery(addressOrAlias);
        fail('It should fail');

      } catch (e) {

        expect(scDeleteMock).not.toHaveBeenCalled();
        expect(error).toHaveBeenCalledWith(hancockContractNotFoundError);
        expect(e).toEqual(hancockContractNotFoundError);

      }

    });

    it('should throw an exception if there are problems deleting the token (error retrieving contractModel)', async () => {

      const throwedError: Error = new Error('Boom!');
      getSmartContractByAddressOrAliasMock.mockRejectedValueOnce(throwedError);

      try {

        await tokenDeleteDomain.tokenDeleteByQuery(addressOrAlias);
        fail('It should fail');

      } catch (e) {

        expect(scDeleteMock).not.toHaveBeenCalled();
        expect(error).toHaveBeenCalledWith(hancockDbError, throwedError);
        expect(e).toEqual(hancockDbError);

      }

    });

  });

});
