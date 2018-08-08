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
import { hancockContractAbiError, hancockContractInvokeError } from '../../smartContract/models/error';
import { hancockContractTokenTransferFromError } from '../models/error';
import * as tokenTransferFromDomain from '../transferFrom';

jest.mock('../../../../db/ethereum');
jest.mock('../../smartContract/common');
jest.mock('../../smartContract/invoke');
jest.mock('../../../../utils/logger');
jest.mock('../../../../utils/error');

describe('tokenTransferFromDomain', () => {

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
        sender: 'mockSender',
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
        method: 'transferFrom',
        params: [iEthereumERC20TransferRequest.sender, iEthereumERC20TransferRequest.to, iEthereumERC20TransferRequest.value],
        to: iEthereumERC20TransferRequest.smartContractAddress,
      };

      dbMock.mockResolvedValueOnce(iEthereumContractDbModel);
      commonMock.mockResolvedValueOnce(iEthereumSmartContractRawTxResponse);

      const result = await tokenTransferFromDomain.tokenTransferFrom(iEthereumERC20TransferRequest);

      expect(dbMock).toHaveBeenCalledTimes(1);
      expect(commonMock).toHaveBeenCalledWith(invokeModel);
      expect(result).toEqual(iEthereumSmartContractRawTxResponse);

    });

    it('should throw an exception if there are problems adapting the call', async () => {

      dbMock.mockResolvedValueOnce(iEthereumContractDbModel);
      commonMock.mockRejectedValueOnce(hancockContractTokenTransferFromError);

      try {

        await tokenTransferFromDomain.tokenTransferFrom(iEthereumERC20TransferRequest);
        fail('It should fail');

      } catch (e) {

        expect(commonMock).toHaveBeenCalledTimes(1);
        expect(error).toHaveBeenCalledWith(hancockContractInvokeError, hancockContractTokenTransferFromError);
        expect(e).toEqual(hancockContractInvokeError);

      }

    });

    it('should throw an exception if there are problems retrieving the contractModels (null)', async () => {

      dbMock.mockResolvedValue(null);

      try {

        await tokenTransferFromDomain.tokenTransferFrom(iEthereumERC20TransferRequest);
        fail('It should fail');

      } catch (e) {

        expect(dbMock).toHaveBeenCalledTimes(1);
        expect(error).toHaveBeenCalledWith(hancockContractAbiError);
        expect(e).toEqual(hancockContractAbiError);

      }

    });

    it('should throw an exception if there are problems retrieving the contractModels', async () => {

      dbMock.mockRejectedValueOnce(hancockDbError);

      try {

        await tokenTransferFromDomain.tokenTransferFrom(iEthereumERC20TransferRequest);
        fail('It should fail');

      } catch (e) {

        expect(dbMock).toHaveBeenCalledTimes(1);
        expect(error).toHaveBeenCalledWith(hancockDbError, hancockDbError);
        expect(e).toEqual(hancockDbError);

      }

    });

    it('should call invokeByQuery method and return an adapted transfer', async () => {

      const invokeModel: IEthereumSmartContractInvokeByQueryRequest = {
        action: 'send',
        from: iEthereumERC20TransferRequest.from,
        method: 'transferFrom',
        params: [iEthereumERC20TransferRequest.sender, iEthereumERC20TransferRequest.to, iEthereumERC20TransferRequest.value],
      };

      invokeMock.mockResolvedValueOnce(iEthereumSmartContractRawTxResponse);

      const result = await tokenTransferFromDomain.tokenTransferFromByQuery('mockedAddress', iEthereumERC20TransferRequest);

      expect(invokeMock).toHaveBeenCalledWith('mockedAddress', invokeModel);
      expect(result).toEqual(iEthereumSmartContractRawTxResponse);

    });

    it('should throw an exception if there are problems retrieving the contractModels', async () => {

      invokeMock.mockRejectedValueOnce(hancockContractTokenTransferFromError);

      try {

        await tokenTransferFromDomain.tokenTransferFromByQuery('mockedAddress', iEthereumERC20TransferRequest);
        fail('It should fail');

      } catch (e) {

        expect(invokeMock).toHaveBeenCalledTimes(1);
        expect(e).toEqual(hancockContractTokenTransferFromError);

      }

    });

  });

});
