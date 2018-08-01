import 'jest';
import * as db from '../../../../db/ethereum';
import { hancockDbError } from '../../../../models/error';
import {
  IEthereumSmartContractInvokeByQueryRequest,
  IEthereumSmartContractInvokeModel,
} from '../../../../models/ethereum';
import { error } from '../../../../utils/error';
import { hancockContractNotFoundError } from '../../models/error';
import * as commonDomain from '../../smartContract/common';
import { invokeByQuery } from '../../smartContract/invoke';
import { hancockContractInvokeError } from '../../smartContract/models/error';
import * as tokenAllowanceDomain from '../allowance';
import { hancockContractTokenAllowanceError, hancockContractTokenTransferFromError } from '../models/error';

jest.mock('../../../../db/ethereum');
jest.mock('../../smartContract/common');
jest.mock('../../smartContract/invoke');
jest.mock('../../../../utils/logger');
jest.mock('../../../../utils/error');

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
      commonMock.mockReset();

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

    it('should throw an exception if there are problems retrieving the contractModels (null)', async () => {

      dbMock.mockResolvedValueOnce(null);

      try {

        await tokenAllowanceDomain.tokenAllowance(iEthereumERC20AllowanceRequest);
        fail('It should fail');

      } catch (e) {

        expect(dbMock).toHaveBeenCalledTimes(1);
        expect(error).toHaveBeenCalledWith(hancockContractNotFoundError);
        expect(e).toEqual(hancockContractNotFoundError);

      }

    });

    it('should throw an exception if there are problems retrieving the contractModels', async () => {

      dbMock.mockRejectedValueOnce(hancockContractNotFoundError);

      try {

        await tokenAllowanceDomain.tokenAllowance(iEthereumERC20AllowanceRequest);
        fail('It should fail');

      } catch (e) {

        expect(dbMock).toHaveBeenCalledTimes(1);
        expect(error).toHaveBeenCalledWith(hancockDbError, hancockContractNotFoundError);
        expect(e).toEqual(hancockDbError);

      }

    });

    it('should throw an exception if there are problems adapting the call', async () => {

      dbMock.mockResolvedValueOnce(iEthereumContractDbModel);
      commonMock.mockRejectedValueOnce(hancockContractTokenAllowanceError);

      try {

        await tokenAllowanceDomain.tokenAllowance(iEthereumERC20AllowanceRequest);
        fail('It should fail');

      } catch (e) {

        expect(commonMock).toHaveBeenCalledTimes(1);
        expect(error).toHaveBeenCalledWith(hancockContractInvokeError, hancockContractTokenAllowanceError);
        expect(e).toEqual(hancockContractInvokeError);

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

    it('should throw an exception if there are problems invoking', async () => {

      invokeMock.mockRejectedValueOnce(hancockContractTokenAllowanceError);

      try {

        await tokenAllowanceDomain.tokenAllowanceByQuery('mockedAddress', iEthereumERC20AllowanceRequest);
        fail('It should fail');

      } catch (e) {

        expect(invokeMock).toHaveBeenCalledTimes(1);
        expect(error).toHaveBeenCalledWith(hancockContractInvokeError, hancockContractTokenAllowanceError);
        expect(e).toEqual(hancockContractInvokeError);

      }

    });

  });

});
