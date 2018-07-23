import 'jest';
import { IEthereumSmartContractInvokeByQueryRequest, IEthereumSmartContractRequestAction } from '../../../../models/ethereum';
import * as scRegisterDomain from '../../smartContract/register';
import * as common from '../common';

jest.mock('../../smartContract/register');

describe('commonDomain', () => {

  describe('::getRequestModel', () => {

    it('should call getRequestModel method', async () => {

      const action: IEthereumSmartContractRequestAction = 'call';
      const callParams = {
        action,
        from: '0x1234',
        method: 'testMethod',
        params: [],
      };
      const result: IEthereumSmartContractInvokeByQueryRequest =
      common.getRequestModel(callParams.action, callParams.from, callParams.method, callParams.params);

      expect(result).toEqual(callParams);

    });

  });

  describe('::getAdaptRequestModel', () => {

    it('should call getAdaptRequestModel method', async () => {

      const action: IEthereumSmartContractRequestAction = 'call';
      const callParams = {
        abi: [],
        action,
        from: '',
        method: 'testMethod',
        params: [],
        to: 'mockedTo',
      };
      const result: IEthereumSmartContractInvokeByQueryRequest =
      common.getAdaptRequestModel(callParams.abi, callParams.action, callParams.method, callParams.params, callParams.to);

      expect(result).toEqual(callParams);

    });

  });

});
