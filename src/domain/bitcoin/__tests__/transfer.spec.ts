
import 'jest';
import * as bitcoin from '../../../utils/bitcoin/bitcoin';
import * as utils from '../../../utils/utils';
import { hancockBitcoinTransferError } from '../models/error';
import * as transferDomain from '../transfer';

jest.mock('../../../utils/bitcoin/bitcoin');
jest.mock('../../../utils/utils');
jest.mock('../../../utils/logger');
jest.mock('../../../utils/error');

describe('transferDomain', () => {

  const transferPayload: any = {
    data: 'notHexString',
    from: '1address',
    to: '3address',
    value: '1000',
    whatever: 'whatever',
  };

  const clientMock: jest.Mock = (bitcoin as any).__client__;
  const getUtxoMock: jest.Mock = (bitcoin as any).__client__.api.getUtxo;
  const transactionClassMock: jest.Mock = (bitcoin as any).__client__.lib.Transaction;
  const transactionInstanceMock: any = (bitcoin as any).__transaction_instance__;

  const strToHexMock: jest.Mock = utils.strToHex as jest.Mock;

  beforeEach(() => {

    jest.clearAllMocks();

  });

  it('should create a new Transaction with the given payload', async () => {

    strToHexMock.mockReturnValue('0xHexString');
    const response: any = 'whatever';

    const utxosResponse: any = [{}];
    getUtxoMock.mockResolvedValueOnce(utxosResponse);
    transactionInstanceMock.serialize.mockResolvedValueOnce(response);

    const result: any = await transferDomain.sendTransfer(transferPayload);
    expect(getUtxoMock).toHaveBeenCalledWith(transferPayload.from);

    expect(transactionInstanceMock.from).toHaveBeenCalledWith(utxosResponse);
    expect(transactionInstanceMock.to).toHaveBeenCalledWith(transferPayload.to, parseInt(transferPayload.value, 10));
    expect(transactionInstanceMock.change).toHaveBeenCalledWith(transferPayload.from);
    expect(transactionInstanceMock.addData).toHaveBeenCalledWith(transferPayload.data);
    expect(transactionInstanceMock.serialize).toHaveBeenCalledWith({ disableIsFullySigned: true });

    expect(result).toEqual(response);

  });

  it('should create a new Transaction and fail if there are errors', async () => {

    delete transferPayload.data;
    const error: Error = new Error('Boom!');

    const utxosResponse: any = [{}];
    getUtxoMock.mockResolvedValueOnce(utxosResponse);
    (transactionInstanceMock.change as jest.Mock).mockRejectedValueOnce(error);

    try {

      const result: any = await transferDomain.sendTransfer(transferPayload);
      fail('it should fail');

    } catch (e) {

      expect(getUtxoMock).toHaveBeenCalledWith(transferPayload.from);
      expect(transactionInstanceMock.addData).not.toHaveBeenCalled();

      expect(e).toEqual(hancockBitcoinTransferError);

    }

  });

});
