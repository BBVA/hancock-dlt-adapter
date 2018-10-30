
import 'jest';
import {
  IEthereumContractDbModel,
  IEthereumSmartContractInvokeByQueryRequest,
  IEthereumSmartContractInvokeRequest,
  IEthereumSmartContractInvokeAbiRequest,
} from '../../../../models/ethereum';
import { error } from '../../../../utils/error';
import * as ethereumScCommonDomain from '../common';
import * as ethereumScInvokeDomain from '../invoke';
import { hancockContractInvokeError } from '../models/error';

jest.mock('../common');
jest.mock('../../../../utils/logger');
jest.mock('../../../../utils/error');

describe('ethereumScInvokeDomain', () => {

  describe('::invoke', () => {

    const retrieveAbiMock: jest.Mock = (ethereumScCommonDomain.retrieveContractAbi as any);
    const adaptContractInvokeMock: jest.Mock = (ethereumScCommonDomain.adaptContractInvoke as any);

    retrieveAbiMock.mockResolvedValue('mockedAbi');

    const invokeRequestMock: IEthereumSmartContractInvokeRequest = {
      urlBase: 'http://mockedUrlBase',
      whatever: 'whatever',
    } as any;

    beforeEach(() => {

      retrieveAbiMock.mockClear();
      adaptContractInvokeMock.mockReset();

    });

    it('should call the common.adaptContractInvoke method and return a success response', async () => {

      const expectedResponse: any = {};
      adaptContractInvokeMock.mockResolvedValueOnce(expectedResponse);

      const result: any = await ethereumScInvokeDomain.invoke(invokeRequestMock);

      expect(retrieveAbiMock).toHaveBeenCalledWith(invokeRequestMock.urlBase);
      expect(adaptContractInvokeMock).toHaveBeenCalledWith({
        ...invokeRequestMock,
        abi: 'mockedAbi',
      });
      expect(result).toEqual(expectedResponse);

    });

    it('should throw an exception if there are problems retrieving abi or calling common.adaptContractInvoke', async () => {

      const throwedError: Error = new Error('Boom!');
      adaptContractInvokeMock.mockRejectedValueOnce(throwedError);

      try {

        await ethereumScInvokeDomain.invoke(invokeRequestMock);
        fail('It should fail');

      } catch (e) {

        expect(retrieveAbiMock).toHaveBeenCalledWith(invokeRequestMock.urlBase);
        expect(adaptContractInvokeMock).toHaveBeenCalledWith({
          ...invokeRequestMock,
          abi: 'mockedAbi',
        });
        expect(e).toEqual(hancockContractInvokeError);

      }

    });

  });

  describe('::invokeAbi', () => {

    const adaptContractInvokeMock: jest.Mock = (ethereumScCommonDomain.adaptContractInvoke as any);

    const invokeAbiRequestMock: IEthereumSmartContractInvokeAbiRequest = {
      abi: 'abi',
      action: 'action',
      from: 'from',
      method: 'method',
      params: 'params',
      to: 'to',
    } as any;

    beforeEach(() => {

      adaptContractInvokeMock.mockReset();

    });

    it('should call the common.adaptContractInvoke method and return a success response', async () => {

      const expectedResponse: any = {};
      adaptContractInvokeMock.mockResolvedValueOnce(expectedResponse);

      const result: any = await ethereumScInvokeDomain.invokeAbi(invokeAbiRequestMock);

      expect(adaptContractInvokeMock).toHaveBeenCalledWith({
        abi: 'abi',
        action: 'action',
        from: 'from',
        method: 'method',
        params: 'params',
        to: 'to',
      });
      expect(result).toEqual(expectedResponse);

    });

    it('should throw an exception if there are problems retrieving abi or calling common.adaptContractInvoke', async () => {

      const throwedError: Error = new Error('Boom!');
      adaptContractInvokeMock.mockRejectedValueOnce(throwedError);

      try {

        await ethereumScInvokeDomain.invokeAbi(invokeAbiRequestMock);
        fail('It should fail');

      } catch (e) {

        expect(adaptContractInvokeMock).toHaveBeenCalledWith({
          abi: 'abi',
          action: 'action',
          from: 'from',
          method: 'method',
          params: 'params',
          to: 'to',
        });
        expect(e).toEqual(hancockContractInvokeError);

      }

    });

  });

  describe('::invokeByQuery', () => {

    const retrieveContractAbiByAddressOrAliasMock: jest.Mock = (ethereumScCommonDomain.retrieveContractAbiByAddressOrAlias as any);
    const adaptContractInvokeMock: jest.Mock = (ethereumScCommonDomain.adaptContractInvoke as any);

    const contractModelResponseMock: IEthereumContractDbModel = {
      abi: 'mockedAbi',
      address: 'mockedAddress',
    } as any;

    retrieveContractAbiByAddressOrAliasMock.mockResolvedValue(contractModelResponseMock);

    const addressOrAlias: string = 'addressOrAlias';
    const invokeRequestMock: IEthereumSmartContractInvokeByQueryRequest = {
      whatever: 'whatever',
    } as any;

    beforeEach(() => {

      retrieveContractAbiByAddressOrAliasMock.mockClear();
      adaptContractInvokeMock.mockReset();

    });

    it('should call the common.adaptContractInvoke method and return a success response (retrieving abi and to params from contractModel)', async () => {

      const expectedResponse: any = {};
      adaptContractInvokeMock.mockResolvedValueOnce(expectedResponse);

      const result: any = await ethereumScInvokeDomain.invokeByQuery(addressOrAlias, invokeRequestMock);

      expect(retrieveContractAbiByAddressOrAliasMock).toHaveBeenCalledWith(addressOrAlias);
      expect(adaptContractInvokeMock).toHaveBeenCalledWith({
        ...invokeRequestMock,
        abi: 'mockedAbi',
        to: 'mockedAddress',
      });
      expect(result).toEqual(expectedResponse);

    });

    it('should throw an exception if there are problems retrieving abi or calling common.adaptContractInvoke', async () => {

      const throwedError: Error = new Error('Boom!');
      adaptContractInvokeMock.mockRejectedValueOnce(throwedError);

      try {

        await ethereumScInvokeDomain.invokeByQuery(addressOrAlias, invokeRequestMock);
        fail('It should fail');

      } catch (e) {

        expect(retrieveContractAbiByAddressOrAliasMock).toHaveBeenCalledWith(addressOrAlias);
        expect(adaptContractInvokeMock).toHaveBeenCalledWith({
          ...invokeRequestMock,
          abi: 'mockedAbi',
          to: 'mockedAddress',
        });
        expect(e).toEqual(hancockContractInvokeError);

      }

    });

  });

});
