
import 'jest';
import * as utils from '../../../utils/utils';
import { hancockEthereumTransferError } from '../models/error';
import * as transferDomain from '../transfer';

jest.mock('../../../utils/utils');
jest.mock('../../../utils/logger');
jest.mock('../../../utils/error');

describe('transferDomain', () => {

  const transferPayload: any = {
    data: 'notHexString',
    whatever: 'whatever',
  };

  const sendTransactionMock: jest.Mock = jest.fn();

  global.ETH = {
    web3: {
      eth: {
        sendTransaction: sendTransactionMock,
      },
    },
  };

  const strToHexMock: jest.Mock = utils.strToHex as jest.Mock;

  beforeEach(() => {

    sendTransactionMock.mockReset();
    strToHexMock.mockReset();

  });

  it('should call web3.eth.sendTransaction with the given payload', async () => {

    strToHexMock.mockReturnValue('0xHexString');
    const response: any = 'whatever';

    sendTransactionMock.mockImplementationOnce((transfer, callback) => {
      callback(null, response);
    });

    const result: any = await transferDomain.sendTransfer(transferPayload);

    const firstCall = sendTransactionMock.mock.calls[0];
    expect(firstCall[0]).toEqual(transferPayload);
    expect(firstCall[0].data).toBe('0xHexString');
    expect(result).toEqual(response);

  });

  it('should call web3.eth.sendTransaction and fail if there are errors', async () => {

    delete transferPayload.data;

    sendTransactionMock.mockImplementationOnce((transfer, callback) => {
      callback(hancockEthereumTransferError);
    });

    try {

      await transferDomain.sendTransfer(transferPayload);
      fail('it should fail');

    } catch (e) {

      const firstCall = sendTransactionMock.mock.calls[0];
      expect(firstCall[0]).toEqual(transferPayload);
      expect(firstCall[0].data).toBeUndefined();
      expect(e).toEqual(hancockEthereumTransferError);

    }

  });

});
