
import 'jest';
import * as db from '../../../../db/ethereum';
import { hancockDbError } from '../../../../models/error';
import {
  IEthereumSmartContractInvokeByQueryRequest,
  IEthereumSmartContractInvokeModel,
} from '../../../../models/ethereum';
import { error } from '../../../../utils/error';
import * as approveDomain from '../../../ethereum/token/approve';
import { hancockContractNotFoundError } from '../../models/error';
import { adaptContractInvoke } from '../../smartContract/common';
import { invokeByQuery } from '../../smartContract/invoke';
import { hancockContractAbiError } from '../../smartContract/models/error';
import { getAdaptRequestModel } from '../common';
import { hancockContractTokenApproveError } from '../models/error';

jest.mock('../../../../utils/utils');
jest.mock('../../../../db/ethereum');
jest.mock('../../smartContract/common');
jest.mock('../../smartContract/invoke');
jest.mock('../common.ts');
jest.mock('../../../../utils/logger');
jest.mock('../../../../utils/error');

describe('approveDomain', () => {

  const dbMock: jest.Mock = (db.getAbiByName as any);
  let iEthereumContractDbModel;
  let iEthereumERC20TransferRequest;
  let iEthereumSmartContractRawTxResponse;
  const adaptMock: jest.Mock = (adaptContractInvoke as any);
  const getRequestModelMock: jest.Mock = (getAdaptRequestModel as any);
  const invokeMock: jest.Mock = (invokeByQuery as any);

  describe('tokenApproveTransfer', () => {

    beforeEach(() => {

      dbMock.mockReset();
      adaptMock.mockReset();
      getRequestModelMock.mockReset();

      iEthereumContractDbModel = {
        abi: [],
        name: 'mockName',
      };

      iEthereumContractDbModel = {
        abi: [],
        abiName: 'mockAbiName',
        address: 'mockAddress',
        alias: 'mockAlias',
      };

      iEthereumERC20TransferRequest = {
        from: 'mockFrom',
        smartContractAddress: 'mockScAddress',
        spender: 'mockTo',
        value: 'mockValue',
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

    it('should call the db.getAbiByName method and retrieve the metadata of token', async () => {

      const invokeModel: IEthereumSmartContractInvokeModel = {
        abi: iEthereumContractDbModel.abi,
        action: 'send',
        from: iEthereumERC20TransferRequest.from,
        method: 'approve',
        params: [iEthereumERC20TransferRequest.spender, iEthereumERC20TransferRequest.value],
        to: iEthereumERC20TransferRequest.smartContractAddress,
      };

      dbMock.mockResolvedValueOnce(iEthereumContractDbModel);
      adaptMock.mockResolvedValueOnce(iEthereumSmartContractRawTxResponse);

      const result = await approveDomain.tokenApproveTransfer(iEthereumERC20TransferRequest);

      expect(dbMock).toHaveBeenCalledTimes(1);
      expect(adaptMock).toHaveBeenCalledWith(invokeModel);
      expect(result).toEqual(iEthereumSmartContractRawTxResponse);

    });

    it('should fail if there are errors', async () => {

      dbMock.mockResolvedValueOnce(iEthereumContractDbModel);

      adaptMock.mockRejectedValueOnce(hancockContractTokenApproveError);

      try {

        await approveDomain.tokenApproveTransfer(iEthereumERC20TransferRequest);
        fail('it should fail');

      } catch (e) {

        expect(adaptMock).toHaveBeenCalledTimes(1);
        expect(error).toHaveBeenCalledWith(hancockContractTokenApproveError, hancockContractTokenApproveError);
        expect(e).toEqual(hancockContractTokenApproveError);

      }

    });

    it('should throw an exception if there are problems retrieving the contractModels (null)', async () => {

      dbMock.mockResolvedValue(null);

      try {

        await approveDomain.tokenApproveTransfer(iEthereumERC20TransferRequest);
        fail('It should fail');

      } catch (e) {

        expect(dbMock).toHaveBeenCalledTimes(1);
        expect(error).toHaveBeenCalledWith(hancockContractNotFoundError);
        expect(e).toEqual(hancockContractNotFoundError);

      }

    });

    it('should throw an exception if there are problems retrieving the contractModels', async () => {

      dbMock.mockRejectedValueOnce(hancockDbError);

      try {

        await approveDomain.tokenApproveTransfer(iEthereumERC20TransferRequest);
        fail('It should fail');

      } catch (e) {

        expect(dbMock).toHaveBeenCalledTimes(1);
        expect(error).toHaveBeenCalledWith(hancockDbError, hancockDbError);
        expect(e).toEqual(hancockDbError);

      }

    });

  });

  describe('tokenApproveTransferByQuery', () => {

    beforeEach(() => {
      invokeMock.mockReset();

      iEthereumERC20TransferRequest = {
        from: 'mockFrom',
        smartContractAddress: 'mockScAddress',
        spender: 'mockTo',
        value: 'mockValue',
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

    it('should call invokeByQuery method and return an adapted transfer', async () => {

      const invokeModel: IEthereumSmartContractInvokeByQueryRequest = {
        action: 'send',
        from: iEthereumERC20TransferRequest.from,
        method: 'approve',
        params: [iEthereumERC20TransferRequest.spender, iEthereumERC20TransferRequest.value],
      };

      invokeMock.mockResolvedValueOnce(iEthereumSmartContractRawTxResponse);

      const result = await approveDomain.tokenApproveTransferByQuery('mockedQuery', iEthereumERC20TransferRequest);

      expect(invokeMock).toHaveBeenCalledWith('mockedQuery', invokeModel);
      expect(result).toEqual(iEthereumSmartContractRawTxResponse);

    });

    it('should throw an exception if there are problems retrieving the contractModels', async () => {

      invokeMock.mockRejectedValueOnce(hancockContractTokenApproveError);

      try {

        await approveDomain.tokenApproveTransferByQuery('mockedQuery', iEthereumERC20TransferRequest);
        fail('It should fail');

      } catch (e) {

        expect(invokeMock).toHaveBeenCalledTimes(1);
        expect(error).toHaveBeenCalledWith(hancockContractTokenApproveError, hancockContractTokenApproveError);
        expect(e).toEqual(hancockContractTokenApproveError);

      }

    });

  });

});
