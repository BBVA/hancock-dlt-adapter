import 'jest';
import { TokenNames } from '../../../../models/ethereum';
import { error } from '../../../../utils/error';
import * as scRegisterDomain from '../../smartContract/register';
import { hancockContractTokenRegisterError } from '../models/error';
import * as tokenRegisterDomain from '../register';

jest.mock('../../smartContract/register');
jest.mock('../../../../utils/logger');
jest.mock('../../../../utils/error');

describe('tokenRegisterDomain', () => {

  describe('::tokenRegister', () => {

    const registerInstanceMock: jest.Mock = (scRegisterDomain.registerInstance as any);

    const alias: string = 'mockedAlias';
    const address: string = 'mockedAddress';

    beforeEach(() => {

      registerInstanceMock.mockReset();

    });

    it('should call the smartContract.tokenRegister method and register the token', async () => {

      const result = await tokenRegisterDomain.tokenRegister(alias, address);

      expect(registerInstanceMock).toHaveBeenCalledWith(alias, address, TokenNames.ERC20);
      expect(result).toBeUndefined();

    });

    it('should throw an exception if there are problems registering the token', async () => {

      registerInstanceMock.mockRejectedValueOnce(hancockContractTokenRegisterError);

      try {

        await tokenRegisterDomain.tokenRegister(alias, address);
        fail('It should fail');

      } catch (e) {

        expect(registerInstanceMock).toHaveBeenCalled();
        expect(error).toHaveBeenCalledWith(hancockContractTokenRegisterError, hancockContractTokenRegisterError);
        expect(e).toEqual(hancockContractTokenRegisterError);

      }

    });

  });

});
