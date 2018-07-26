import 'jest';
import { TokenNames } from '../../../../models/ethereum';
import * as scRegisterDomain from '../../smartContract/register';
import * as tokenRegisterDomain from '../register';

jest.mock('../../smartContract/register');
jest.mock('../../../../utils/logger');

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

      const throwedError: Error = new Error('Boom!');
      registerInstanceMock.mockRejectedValueOnce(throwedError);

      try {

        await tokenRegisterDomain.tokenRegister(alias, address);
        fail('It should fail');

      } catch (e) {

        expect(registerInstanceMock).toHaveBeenCalled();
        expect(e).toEqual(throwedError);

      }

    });

  });

});
