
import 'jest';
import {
  ethereumSmartContractSmartcontractErrorResponse,
  IEthereumSmartContractDeployModel,
  IEthereumSmartContractDeployRequest,
} from '../../../../models/ethereum';
import { error } from '../../../../utils/error';
import logger from '../../../../utils/logger';
import * as ethereumScCommonDomain from '../common';
import * as ethereumScDeployDomain from '../deploy';
import { hancockContractAbiError, hancockContractBinaryError, hancockContractDeployError } from '../models/error';

jest.mock('../common');
jest.mock('../../../../utils/logger');
jest.mock('../../../../utils/error');

describe('ethereumScDeployDomain', () => {

  describe('::deploy', () => {

    const retrieveAbiMock: jest.Mock = (ethereumScCommonDomain.retrieveContractAbi as any);
    const retrieveBinMock: jest.Mock = (ethereumScCommonDomain.retrieveContractBinary as any);
    const savedImplementations: { [k: string]: any } = {};

    // tslint:disable-next-line:variable-name
    let _adaptContractDeployMock: jest.Mock;

    beforeAll(() => {

      savedImplementations._adaptContractDeployMock = ethereumScDeployDomain._adaptContractDeploy;

      (ethereumScDeployDomain._adaptContractDeploy as any) = jest.fn();
      _adaptContractDeployMock = (ethereumScDeployDomain._adaptContractDeploy as any);

    });

    afterAll(() => {

      (ethereumScDeployDomain._adaptContractDeploy as any) = savedImplementations._adaptContractDeployMock;

    });

    beforeEach(() => {

      retrieveAbiMock.mockReset();
      retrieveBinMock.mockReset();
      _adaptContractDeployMock.mockReset();

    });

    it('should retrieve the abi and bin from urlBase and adapt the eth.deploy transaction', async () => {

      const deployRequestMock: IEthereumSmartContractDeployRequest = {
        urlBase: 'http://mockedUrlBase',
        whatever: 'whatever',
      } as any;

      const expectedResponse = 'whateverResponse';

      retrieveAbiMock.mockResolvedValueOnce('mockedAbi');
      retrieveBinMock.mockResolvedValueOnce('mockedBinary');
      _adaptContractDeployMock.mockResolvedValueOnce(expectedResponse);

      const result: any = await ethereumScDeployDomain.deploy(deployRequestMock);

      expect(retrieveAbiMock).toHaveBeenCalledWith(deployRequestMock.urlBase);
      expect(retrieveBinMock).toHaveBeenCalledWith(deployRequestMock.urlBase);

      expect(_adaptContractDeployMock).toHaveBeenCalledWith({
        ...deployRequestMock,
        abi: 'mockedAbi',
        bin: 'mockedBinary',
      });

      expect(result).toEqual(expectedResponse);

    });

    it('should throw an exception if there are problems retrieving the abi', async () => {

      const deployRequestMock: IEthereumSmartContractDeployRequest = {} as any;

      retrieveAbiMock.mockRejectedValueOnce(hancockContractAbiError);

      try {

        await ethereumScDeployDomain.deploy(deployRequestMock);
        fail('It should fail');

      } catch (e) {

        expect(error).toHaveBeenCalledWith(hancockContractAbiError, hancockContractAbiError);
        expect(e).toEqual(hancockContractAbiError);

      }

    });

    it('should throw an exception if there are problems retrieving the binary', async () => {

      const deployRequestMock: IEthereumSmartContractDeployRequest = {} as any;

      retrieveAbiMock.mockResolvedValueOnce('mockedAbi');
      retrieveBinMock.mockRejectedValueOnce(hancockContractBinaryError);

      try {

        await ethereumScDeployDomain.deploy(deployRequestMock);
        fail('It should fail');

      } catch (e) {

        expect(error).toHaveBeenCalledWith(hancockContractBinaryError, hancockContractBinaryError);
        expect(e).toEqual(hancockContractBinaryError);

      }

    });

    it('should throw an exception if there are problems retrieving the abi, bin or adapting the transaction', async () => {

      const deployRequestMock: IEthereumSmartContractDeployRequest = {} as any;
      const throwedError: Error = new Error('Boom!');

      retrieveAbiMock.mockResolvedValueOnce('mockedAbi');
      retrieveBinMock.mockResolvedValueOnce('mockedBinary');
      _adaptContractDeployMock.mockRejectedValueOnce(throwedError);

      try {

        await ethereumScDeployDomain.deploy(deployRequestMock);
        fail('It should fail');

      } catch (e) {

        expect(retrieveAbiMock).toHaveBeenCalledWith(deployRequestMock.urlBase);
        expect(retrieveBinMock).toHaveBeenCalledWith(deployRequestMock.urlBase);
        expect(_adaptContractDeployMock).toHaveBeenCalledWith({
          ...deployRequestMock,
          abi: 'mockedAbi',
          bin: 'mockedBinary',
        });
        expect(e).toEqual(hancockContractDeployError);

      }

    });

  });

  describe('::_adaptContractDeploy', () => {

    const contractInstanceDeployWeb3WrapperMock = {
      on: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
    };

    const contractInstanceMock = {
      deploy: jest.fn().mockReturnValue(contractInstanceDeployWeb3WrapperMock),
    };

    global.ETH = {
      web3: {
        eth: {
          Contract: jest.fn().mockImplementation(() => contractInstanceMock),
        },
      },
    };

    const contractConstructorMock: jest.Mock = ETH.web3.eth.Contract;
    const contractInstanceDeployMock: jest.Mock = contractInstanceMock.deploy;

    const contractDeployModelMock: IEthereumSmartContractDeployModel = {
      abi: 'mockedAbi',
      bin: 'mockedBinary',
      from: 'mockedFrom',
      params: ['mockedParams'],
    };

    beforeEach(() => {

      contractConstructorMock.mockClear();
      contractInstanceDeployMock.mockClear();
      contractInstanceDeployWeb3WrapperMock.send.mockReset();
      contractInstanceDeployWeb3WrapperMock.on.mockReset();

    });

    it('should call the web3.eth.deploy api with the given arguments in order to adapt the deploy transaction', async () => {

      const deployResponse: any = 'mockedResponse';

      contractInstanceDeployWeb3WrapperMock.send.mockImplementationOnce((params, callback) => {
        callback(null, deployResponse);
        return contractInstanceDeployWeb3WrapperMock;
      });

      const result: any = await ethereumScDeployDomain._adaptContractDeploy(contractDeployModelMock);

      // new instance of web3 SM
      expect(contractConstructorMock).toHaveBeenLastCalledWith(contractDeployModelMock.abi);

      // deploy web3 wrapper generated
      const callExpectedParams = { data: '0x' + contractDeployModelMock.bin, arguments: contractDeployModelMock.params };
      expect(contractInstanceDeployMock).toHaveBeenCalledWith(callExpectedParams);

      // web3 wrapper called
      expect(contractInstanceDeployWeb3WrapperMock.send.mock.calls[0][0]).toEqual({ from: contractDeployModelMock.from });

      // returned value is right
      expect(result).toEqual(deployResponse);

    });

    it('should throw an exception if there are problems adapting the deploy transaction', async () => {

      const throwedError: Error = new Error('Boom!');

      contractInstanceDeployWeb3WrapperMock.send.mockImplementationOnce((params, callback) => {
        callback(throwedError, undefined);
        return contractInstanceDeployWeb3WrapperMock;
      });

      try {

        await ethereumScDeployDomain._adaptContractDeploy(contractDeployModelMock);
        fail('it should fail');

      } catch (e) {

        // new instance of web3 SM
        expect(contractConstructorMock).toHaveBeenLastCalledWith(contractDeployModelMock.abi);

        // method web3 wrapper generated
        const callExpectedParams = { data: '0x' + contractDeployModelMock.bin, arguments: contractDeployModelMock.params };
        expect(contractInstanceDeployMock).toHaveBeenCalledWith(callExpectedParams);

        // web3 wrapper called
        expect(contractInstanceDeployWeb3WrapperMock.send.mock.calls[0][0]).toEqual({ from: contractDeployModelMock.from });

        // rejected error is ok
        expect(e).toEqual(hancockContractDeployError);

      }

    });

    it('should listen an exception with onError handler if there are problems adapting the deploy transaction', async () => {

      const throwedError: Error = new Error('Boom!');

      contractInstanceDeployWeb3WrapperMock.send.mockReturnThis();
      contractInstanceDeployWeb3WrapperMock.on.mockImplementationOnce((event, callback) => {
        callback(new Error('Boom!'));
        return contractInstanceDeployWeb3WrapperMock;
      });

      try {

        await ethereumScDeployDomain._adaptContractDeploy(contractDeployModelMock);
        fail('it should fail');

      } catch (e) {

        // new instance of web3 SM
        expect(contractConstructorMock).toHaveBeenLastCalledWith(contractDeployModelMock.abi);

        // method web3 wrapper generated
        const callExpectedParams = { data: '0x' + contractDeployModelMock.bin, arguments: contractDeployModelMock.params };
        expect(contractInstanceDeployMock).toHaveBeenCalledWith(callExpectedParams);

        // web3 wrapper called
        expect(contractInstanceDeployWeb3WrapperMock.send.mock.calls[0][0]).toEqual({ from: contractDeployModelMock.from });

        // rejected error is ok
        expect(e).toEqual(hancockContractDeployError);

      }

    });

  });

});
