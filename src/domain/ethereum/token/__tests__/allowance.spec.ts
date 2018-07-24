import 'jest';
import * as db from '../../../../db/ethereum';
import {
  IEthereumSmartContractInvokeByQueryRequest,
  IEthereumSmartContractInvokeModel,
} from '../../../../models/ethereum';
import * as commonDomain from '../../smartContract/common';
import { invokeByQuery } from '../../smartContract/invoke';
import * as tokenAllowanceDomain from '../allowance';

jest.mock('../../../../db/ethereum');
jest.mock('../../smartContract/common');
jest.mock('../../smartContract/invoke');

describe('tokenAllowanceDomain', () => {

  describe('::allowance', () => {

    const dbMock: jest.Mock = (db.getAbiByName as any);
    const commonMock: jest.Mock = (commonDomain.adaptContractInvoke as any);
    const invokeMock: jest.Mock = (invokeByQuery as any);
    let iEthereumERC20AllowanceRequest;
    let iEthereumContractDbModel;
    let iEthereumSmartContractRawTxResponse;

    beforeEach(() => {

      dbMock.mockReset();
      invokeMock.mockReset();

      iEthereumERC20AllowanceRequest = {
        from: 'mockFrom',
        smartContractAddress: 'mockScAddress',
        spender: 'mockSpender',
        tokenOwner: 'mockTokenOwner',
      };

      iEthereumContractDbModel = {
        abi: [],
        abiName: 'mockAbiName',
        address: 'mockAddress',
        alias: 'mockAlias',
      };

      iEthereumSmartContractRawTxResponse =  {
        data: 'mockData',
        from: 'mockFrom',
        gas: 'mockGas',
        gasPrice: 'mockGasPrice',
        to: 'mockTo',
        value: 'mockValue',
      };

    });

    it('should call the db.getAbiByName method and return an adapted allowance', async () => {

      const invokeModel: IEthereumSmartContractInvokeModel = {
        abi: iEthereumContractDbModel.abi ,
        action: 'send',
        from: iEthereumERC20AllowanceRequest.from,
        method: 'allowance',
        params: [iEthereumERC20AllowanceRequest.tokenOwner, iEthereumERC20AllowanceRequest.spender],
        to: iEthereumERC20AllowanceRequest.smartContractAddress,
      };

      dbMock.mockResolvedValueOnce(iEthereumContractDbModel);
      commonMock.mockResolvedValueOnce(iEthereumSmartContractRawTxResponse);

      const result = await tokenAllowanceDomain.tokenAllowance(iEthereumERC20AllowanceRequest);

      expect(dbMock).toHaveBeenCalledTimes(1);
      expect(commonMock).toHaveBeenCalledWith(invokeModel);
      expect(result).toEqual(iEthereumSmartContractRawTxResponse);

    });

    it('should throw an exception if there are problems retrieving the contractModels', async () => {

      const throwedError: Error = new Error('Boom!');
      dbMock.mockRejectedValueOnce(throwedError);

      try {

        await tokenAllowanceDomain.tokenAllowance(iEthereumERC20AllowanceRequest);
        fail('It should fail');

      } catch (e) {

        expect(dbMock).toHaveBeenCalledTimes(1);
        expect(e).toEqual(throwedError);

      }

    });

    it('should call invokeByQuery method and return an adapted allowance', async () => {

      const invokeModel: IEthereumSmartContractInvokeByQueryRequest = {
        action: 'send',
        from: iEthereumERC20AllowanceRequest.from,
        method: 'allowance',
        params: [iEthereumERC20AllowanceRequest.tokenOwner, iEthereumERC20AllowanceRequest.spender],
      };

      invokeMock.mockResolvedValueOnce(iEthereumSmartContractRawTxResponse);

      const result = await tokenAllowanceDomain.tokenAllowanceByQuery('mockedAddress', iEthereumERC20AllowanceRequest);

      expect(invokeMock).toHaveBeenCalledWith('mockedAddress', invokeModel);
      expect(result).toEqual(iEthereumSmartContractRawTxResponse);

    });

    it('should throw an exception if there are problems retrieving the contractModels', async () => {

      const throwedError: Error = new Error('Boom!');
      invokeMock.mockRejectedValueOnce(throwedError);

      try {

        await tokenAllowanceDomain.tokenAllowanceByQuery('mockedAddress', iEthereumERC20AllowanceRequest);
        fail('It should fail');

      } catch (e) {

        expect(invokeMock).toHaveBeenCalledTimes(1);
        expect(e).toEqual(throwedError);

      }

    });

  });

});
