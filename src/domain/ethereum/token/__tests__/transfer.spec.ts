import 'jest';
import * as db from '../../../../db/ethereum';
import {
  IEthereumSmartContractInvokeByQueryRequest,
  IEthereumSmartContractInvokeModel,
} from '../../../../models/ethereum';
import { error } from '../../../../utils/error';
import { hancockContractNotFoundError } from '../../models/error';
import * as commonDomain from '../../smartContract/common';
import { invokeByQuery } from '../../smartContract/invoke';
import { hancockContractAbiError } from '../../smartContract/models/error';
import { hancockContractTokenTransferError } from '../models/error';
import * as tokenTransferDomain from '../transfer';

jest.mock('../../../../db/ethereum');
jest.mock('../../smartContract/common');
jest.mock('../../smartContract/invoke');
jest.mock('../../../../utils/logger');
jest.mock('../../../../utils/error');

describe('tokenTransferDomain', () => {

  describe('::transfer', () => {

    const dbMock: jest.Mock = (db.getAbiByName as any);
    const commonMock: jest.Mock = (commonDomain.adaptContractInvoke as any);
    const invokeMock: jest.Mock = (invokeByQuery as any);
    let iEthereumERC20TransferRequest;
    let iEthereumContractDbModel;
    let iEthereumSmartContractRawTxResponse;

    beforeEach(() => {

      dbMock.mockReset();
      invokeMock.mockReset();
      commonMock.mockReset();

      iEthereumERC20TransferRequest = {
        from: 'mockFrom',
        smartContractAddress: 'mockScAddress',
        to: 'mockTo',
        value: 'mockValue',
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

    it('should call the db.getAbiByName method and return an adapted transfer', async () => {

      const invokeModel: IEthereumSmartContractInvokeModel = {
        abi: iEthereumContractDbModel.abi ,
        action: 'send',
        from: iEthereumERC20TransferRequest.from,
        method: 'transfer',
        params: [iEthereumERC20TransferRequest.to, iEthereumERC20TransferRequest.value],
        to: iEthereumERC20TransferRequest.smartContractAddress,
      };

      dbMock.mockResolvedValueOnce(iEthereumContractDbModel);
      commonMock.mockResolvedValueOnce(iEthereumSmartContractRawTxResponse);

      const result = await tokenTransferDomain.tokenTransfer(iEthereumERC20TransferRequest);

      expect(dbMock).toHaveBeenCalledTimes(1);
      expect(commonMock).toHaveBeenCalledWith(invokeModel);
      expect(result).toEqual(iEthereumSmartContractRawTxResponse);

    });

    it('should throw an exception if there are problems retrieving the contractModels (null)', async () => {

      dbMock.mockResolvedValueOnce(null);

      try {

        await tokenTransferDomain.tokenTransfer(iEthereumERC20TransferRequest);
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

        await tokenTransferDomain.tokenTransfer(iEthereumERC20TransferRequest);
        fail('It should fail');

      } catch (e) {

        expect(dbMock).toHaveBeenCalledTimes(1);
        expect(error).toHaveBeenCalledWith(hancockContractAbiError, hancockContractNotFoundError);
        expect(e).toEqual(hancockContractAbiError);

      }

    });

    it('should throw an exception if there are problems adapting the call', async () => {

      commonMock.mockRejectedValueOnce(hancockContractTokenTransferError);
      dbMock.mockResolvedValueOnce(iEthereumContractDbModel);

      try {

        await tokenTransferDomain.tokenTransfer(iEthereumERC20TransferRequest);
        fail('It should fail');

      } catch (e) {

        expect(commonMock).toHaveBeenCalledTimes(1);
        expect(error).toHaveBeenCalledWith(hancockContractTokenTransferError, hancockContractTokenTransferError);
        expect(e).toEqual(hancockContractTokenTransferError);

      }

    });

    it('should call invokeByQuery method and return an adapted transfer', async () => {

      const invokeModel: IEthereumSmartContractInvokeByQueryRequest = {
        action: 'send',
        from: iEthereumERC20TransferRequest.from,
        method: 'transfer',
        params: [iEthereumERC20TransferRequest.to, iEthereumERC20TransferRequest.value],
      };

      invokeMock.mockResolvedValueOnce(iEthereumSmartContractRawTxResponse);

      const result = await tokenTransferDomain.tokenTransferByQuery('mockedAddress', iEthereumERC20TransferRequest);

      expect(invokeMock).toHaveBeenCalledWith('mockedAddress', invokeModel);
      expect(result).toEqual(iEthereumSmartContractRawTxResponse);

    });

    it('should throw an exception if there are problems retrieving the contractModels', async () => {

      invokeMock.mockRejectedValueOnce(hancockContractTokenTransferError);

      try {

        await tokenTransferDomain.tokenTransferByQuery('mockedAddress', iEthereumERC20TransferRequest);
        fail('It should fail');

      } catch (e) {

        expect(invokeMock).toHaveBeenCalledTimes(1);
        expect(error).toHaveBeenCalledWith(hancockContractTokenTransferError, hancockContractTokenTransferError);
        expect(e).toEqual(hancockContractTokenTransferError);

      }

    });

  });

});
