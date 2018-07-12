import 'jest';
import * as db from '../../../../db/ethereum';
import {
  EthereumSmartContractInternalServerErrorResponse,
  IEthereumContractDbModel,
  IEthereumSmartContractInvokeModel,
} from '../../../../models/ethereum';
import * as commonDomain from '../../smartContract/common';
import * as tokenTransferDomain from '../transfer';

jest.mock('../../../../db/ethereum');
jest.mock('../../smartContract/common');

describe('tokenTransferDomain', () => {

  describe('::transfer', () => {

    const dbMock: jest.Mock = (db.getAbiByName as any);
    const commonMock: jest.Mock = (commonDomain.adaptContractInvoke as any);
    let iEthereumERC20TransferRequest;
    let iEthereumContractDbModel;

    beforeEach(() => {

      dbMock.mockReset();

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

      const iEthereumSmartContractRawTxResponse =  {
        data: 'mockData',
        from: 'mockFrom',
        gas: 'mockGas',
        gasPrice: 'mockGasPrice',
        to: 'mockTo',
        value: 'mockValue',
      };

      dbMock.mockResolvedValueOnce(iEthereumContractDbModel);
      commonMock.mockResolvedValueOnce(iEthereumSmartContractRawTxResponse);

      const result = await tokenTransferDomain.tokenTransfer(iEthereumERC20TransferRequest);

      expect(dbMock).toHaveBeenCalledTimes(1);
      expect(commonMock).toHaveBeenCalledWith(invokeModel);
      expect(result).toEqual(iEthereumSmartContractRawTxResponse);

    });

    it('should throw an exception if there are problems retrieving the contractModels', async () => {

      const throwedError: Error = new Error('Boom!');
      dbMock.mockRejectedValueOnce(throwedError);

      try {

        await tokenTransferDomain.tokenTransfer(iEthereumERC20TransferRequest);
        fail('It should fail');

      } catch (e) {

        expect(dbMock).toHaveBeenCalledTimes(1);
        expect(e).toEqual(throwedError);

      }

    });

  });

});
