
import 'jest';
import * as request from 'request-promise-native';
import * as db from '../../../../db/ethereum';
import {
  ContractAbi,
  EthereumSmartContractInternalServerErrorResponse,
  EthereumSmartContractNotFoundResponse,
  EthereumSmartContractSourcecodeNotFoundErrorResponse,
  IEthereumContractDbModel,
  IEthereumSmartContractInvokeModel,
  IEthereumSmartContractRawTxResponse,
} from '../../../../models/ethereum';
import * as ethereumScCommonDomain from '../common';

jest.mock('request-promise-native');
jest.mock('../../../../db/ethereum');

describe('ethereumScCommonDomain', () => {

  describe('::retrieveContractAbiByAddressOrAlias', () => {

    const dbMock: jest.Mock = (db.getSmartContractByAddressOrAlias as jest.Mock);

    beforeEach(() => {

      dbMock.mockReset();

    });

    it('should return the smartcontract model from db', async () => {

      const addressOrAlias: string = 'whatever';
      const contractModelResponse: IEthereumContractDbModel | null = {} as IEthereumContractDbModel;

      dbMock.mockResolvedValueOnce(contractModelResponse);

      const result: any = await ethereumScCommonDomain.retrieveContractAbiByAddressOrAlias(addressOrAlias);

      expect(dbMock).toHaveBeenLastCalledWith(addressOrAlias);
      expect(result).toEqual(contractModelResponse);

    });

    it('should throw an exception if the smartcontract is not found', async () => {

      const addressOrAlias: string = 'whatever';

      dbMock.mockResolvedValueOnce(null);

      try {

        await ethereumScCommonDomain.retrieveContractAbiByAddressOrAlias(addressOrAlias);
        fail('it should fail');

      } catch (e) {

        expect(dbMock).toHaveBeenLastCalledWith(addressOrAlias);
        expect(e).toEqual(EthereumSmartContractNotFoundResponse);

      }

    });

    it('should throw an exception if there are problems retrieving the smartcontract', async () => {

      const addressOrAlias: string = 'whatever';

      dbMock.mockRejectedValueOnce(new Error('Boom!'));

      try {

        await ethereumScCommonDomain.retrieveContractAbiByAddressOrAlias(addressOrAlias);
        fail('it should fail');

      } catch (e) {

        expect(dbMock).toHaveBeenLastCalledWith(addressOrAlias);
        expect(e).toEqual(EthereumSmartContractInternalServerErrorResponse);

      }

    });

  });

  describe('::retrieveContractAbi', () => {

    const requestMock: jest.Mock = (request as any);

    beforeEach(() => {

      requestMock.mockReset();

    });

    it('should return the smartcontract abi from the urlBase', async () => {

      const urlBase: string = 'http://whatever';
      const contractAbiResponse: string = '[{"abi":"whatever"}]';
      const expectedResponse: ContractAbi = [{ abi: 'whatever' }];

      requestMock.mockResolvedValueOnce(contractAbiResponse);

      const result: ContractAbi = await ethereumScCommonDomain.retrieveContractAbi(urlBase);

      expect(requestMock).toHaveBeenLastCalledWith(`${urlBase}.abi`);
      expect(result).toEqual(expectedResponse);

    });

    it('should throw an exception if there are problems retrieving the smartcontract abi', async () => {

      const urlBase: string = 'http://whatever';

      requestMock.mockRejectedValueOnce(new Error('Boom!'));

      try {

        await ethereumScCommonDomain.retrieveContractAbi(urlBase);
        fail('it should fail');

      } catch (e) {

        expect(requestMock).toHaveBeenLastCalledWith(`${urlBase}.abi`);
        expect(e).toEqual(EthereumSmartContractSourcecodeNotFoundErrorResponse);

      }

    });

  });

  describe('::retrieveContractBinary', () => {

    const requestMock: jest.Mock = (request as any);

    beforeEach(() => {

      requestMock.mockReset();

    });

    it('should return the smartcontract binary from the urlBase', async () => {

      const urlBase: string = 'http://whatever';
      const contractAbiResponse: string = '0xMockedResponseBinary';

      requestMock.mockResolvedValueOnce(contractAbiResponse);

      const result: string = await ethereumScCommonDomain.retrieveContractBinary(urlBase);

      expect(requestMock).toHaveBeenLastCalledWith(`${urlBase}.bin`);
      expect(result).toEqual(contractAbiResponse);

    });

    it('should throw an exception if there are problems retrieving the smartcontract binary', async () => {

      const urlBase: string = 'http://whatever';

      requestMock.mockRejectedValueOnce(new Error('Boom!'));

      try {

        await ethereumScCommonDomain.retrieveContractBinary(urlBase);
        fail('it should fail');

      } catch (e) {

        expect(requestMock).toHaveBeenLastCalledWith(`${urlBase}.bin`);
        expect(e).toEqual(EthereumSmartContractSourcecodeNotFoundErrorResponse);

      }

    });

  });

  describe('::adaptContractInvoke', () => {

    const methodMock: string = 'mockMethod';

    const contractInstanceMethodWeb3WrapperMock = {
      call: jest.fn(),
      send: jest.fn(),
    };

    const contractInstanceMock = {
      methods: {
        [methodMock]: jest.fn().mockReturnValue(contractInstanceMethodWeb3WrapperMock),
      },
    };

    global.ETH = {
      web3: {
        eth: {
          Contract: jest.fn().mockImplementation(() => contractInstanceMock),
        },
      },
    };

    const contractConstructorMock: jest.Mock = ETH.web3.eth.Contract;
    const contractInstanceMethodMock: jest.Mock = contractInstanceMock.methods[methodMock];

    const contractInvokeReqMock: IEthereumSmartContractInvokeModel = {
      abi: 'mockAbi',
      // action: 'call',
      from: 'mockFrom',
      method: methodMock,
      params: ['mockParams'],
      to: 'mockTo',
    } as any;

    beforeEach(() => {

      delete contractInvokeReqMock.action;
      contractConstructorMock.mockClear();
      contractInstanceMethodMock.mockClear();
      contractInstanceMethodWeb3WrapperMock.call.mockReset();
      contractInstanceMethodWeb3WrapperMock.send.mockReset();

    });

    it('should invoke the smartcontract method doing a "call" action', async () => {

      contractInvokeReqMock.action = 'call';
      const invokeResponse: any = 'mockedResponse';

      contractInstanceMethodWeb3WrapperMock.call.mockImplementationOnce((params, callback) => {
        callback(null, invokeResponse);
      });

      const result: IEthereumSmartContractRawTxResponse = await ethereumScCommonDomain.adaptContractInvoke(contractInvokeReqMock);

      // new instance of web3 SM
      expect(contractConstructorMock).toHaveBeenLastCalledWith(contractInvokeReqMock.abi, contractInvokeReqMock.to);

      // method web3 wrapper generated
      expect(contractInstanceMethodMock).toHaveBeenCalledWith(...(contractInvokeReqMock.params as string[]));

      // web3 wrapper called
      expect(contractInstanceMethodWeb3WrapperMock.call.mock.calls[0][0]).toEqual({ from: contractInvokeReqMock.from });

      // returned value is right
      expect(result).toEqual(invokeResponse);

    });

    it('should throw an exception if there are problems invoking the smartcontract method doing a "call" action', async () => {

      contractInvokeReqMock.action = 'call';
      const throwedError: Error = new Error('Boom!');

      contractInstanceMethodWeb3WrapperMock.call.mockImplementationOnce((params, callback) => {
        callback(throwedError, undefined);
      });

      try {

        await ethereumScCommonDomain.adaptContractInvoke(contractInvokeReqMock);
        fail('it should fail');

      } catch (e) {

        // new instance of web3 SM
        expect(contractConstructorMock).toHaveBeenLastCalledWith(contractInvokeReqMock.abi, contractInvokeReqMock.to);

        // method web3 wrapper generated
        expect(contractInstanceMethodMock).toHaveBeenCalledWith(...(contractInvokeReqMock.params as string[]));

        // web3 wrapper called
        expect(contractInstanceMethodWeb3WrapperMock.call.mock.calls[0][0]).toEqual({ from: contractInvokeReqMock.from });

        // rejected error is ok
        expect(e).toEqual(throwedError);

      }

    });

    it('should invoke the smartcontract method doing a "send" action', async () => {

      contractInvokeReqMock.action = 'send';
      const invokeResponse: any = 'mockedResponse';

      contractInstanceMethodWeb3WrapperMock.send.mockImplementationOnce((params, callback) => {
        callback(null, invokeResponse);
      });

      const result: IEthereumSmartContractRawTxResponse = await ethereumScCommonDomain.adaptContractInvoke(contractInvokeReqMock);

      // new instance of web3 SM
      expect(contractConstructorMock).toHaveBeenLastCalledWith(contractInvokeReqMock.abi, contractInvokeReqMock.to);

      // method web3 wrapper generated
      expect(contractInstanceMethodMock).toHaveBeenCalledWith(...(contractInvokeReqMock.params as string[]));

      // web3 wrapper called
      expect(contractInstanceMethodWeb3WrapperMock.send.mock.calls[0][0]).toEqual({ from: contractInvokeReqMock.from });

      // returned value is right
      expect(result).toEqual(invokeResponse);

    });

    it('should throw an exception if there are problems invoking the smartcontract method doing a "send" action', async () => {

      contractInvokeReqMock.action = 'send';
      const throwedError: Error = new Error('Boom!');

      contractInstanceMethodWeb3WrapperMock.send.mockImplementationOnce((params, callback) => {
        callback(throwedError, undefined);
      });

      try {

        await ethereumScCommonDomain.adaptContractInvoke(contractInvokeReqMock);
        fail('it should fail');

      } catch (e) {

        // new instance of web3 SM
        expect(contractConstructorMock).toHaveBeenLastCalledWith(contractInvokeReqMock.abi, contractInvokeReqMock.to);

        // method web3 wrapper generated
        expect(contractInstanceMethodMock).toHaveBeenCalledWith(...(contractInvokeReqMock.params as string[]));

        // web3 wrapper called
        expect(contractInstanceMethodWeb3WrapperMock.send.mock.calls[0][0]).toEqual({ from: contractInvokeReqMock.from });

        // rejected error is ok
        expect(e).toEqual(throwedError);

      }

    });

  });

});
