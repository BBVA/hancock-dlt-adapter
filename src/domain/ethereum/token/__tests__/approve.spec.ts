
import 'jest';
import * as db from '../../../../db/ethereum';
import {
  IEthereumSmartContractInvokeByQueryRequest,
  IEthereumSmartContractInvokeModel,
} from '../../../../models/ethereum';
import * as approveDomain from '../../../ethereum/token/approve';
import { adaptContractInvoke } from '../../smartContract/common';
import { invokeByQuery } from '../../smartContract/invoke';
import { getAdaptRequestModel } from '../common';

jest.mock('../../../../utils/utils');
jest.mock('../../../../db/ethereum');
jest.mock('../../smartContract/common');
jest.mock('../../smartContract/invoke');
jest.mock('../common.ts');

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

      const throwedError = new Error('Boom!');

      dbMock.mockResolvedValueOnce(iEthereumContractDbModel);

      adaptMock.mockRejectedValueOnce(throwedError);

      try {

        await approveDomain.tokenApproveTransfer(iEthereumERC20TransferRequest);
        fail('it should fail');

      } catch (e) {

        expect(adaptMock).toHaveBeenCalledTimes(1);
        expect(e).toEqual(throwedError);

      }

    });

    it('should throw an exception if there are problems retrieving the contractModels', async () => {

      const throwedError: Error = new Error('Boom!');
      dbMock.mockRejectedValueOnce(throwedError);

      try {

        await approveDomain.tokenApproveTransfer(iEthereumERC20TransferRequest);
        fail('It should fail');

      } catch (e) {

        expect(dbMock).toHaveBeenCalledTimes(1);
        expect(e).toEqual(throwedError);

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

      const throwedError: Error = new Error('Boom!');
      invokeMock.mockRejectedValueOnce(throwedError);

      try {

        await approveDomain.tokenApproveTransferByQuery('mockedQuery', iEthereumERC20TransferRequest);
        fail('It should fail');

      } catch (e) {

        expect(invokeMock).toHaveBeenCalledTimes(1);
        expect(e).toEqual(throwedError);

      }

    });

  });

});
