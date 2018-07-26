import 'jest';
import * as db from '../../../../db/ethereum';
import {
  IEthereumSmartContractInvokeByQueryRequest,
  IEthereumSmartContractInvokeModel,
} from '../../../../models/ethereum';
import * as commonDomain from '../../smartContract/common';
import { invokeByQuery } from '../../smartContract/invoke';
import * as tokenTransferFromDomain from '../transferFrom';

jest.mock('../../../../db/ethereum');
jest.mock('../../smartContract/common');
jest.mock('../../smartContract/invoke');
jest.mock('../../../../utils/logger');

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

    it('should throw an exception if there are problems retrieving the contractModels', async () => {

      const throwedError: Error = new Error('Boom!');
      dbMock.mockRejectedValueOnce(throwedError);

      try {

        await tokenTransferFromDomain.tokenTransferFrom(iEthereumERC20TransferRequest);
        fail('It should fail');

      } catch (e) {

        expect(dbMock).toHaveBeenCalledTimes(1);
        expect(e).toEqual(throwedError);

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

      const throwedError: Error = new Error('Boom!');
      invokeMock.mockRejectedValueOnce(throwedError);

      try {

        await tokenTransferFromDomain.tokenTransferFromByQuery('mockedAddress', iEthereumERC20TransferRequest);
        fail('It should fail');

      } catch (e) {

        expect(invokeMock).toHaveBeenCalledTimes(1);
        expect(e).toEqual(throwedError);

      }

    });

  });

});
