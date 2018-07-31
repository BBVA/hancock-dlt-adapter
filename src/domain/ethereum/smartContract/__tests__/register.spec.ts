import 'jest';
import { InsertOneWriteOpResult, WriteOpResult } from 'mongodb';
import * as db from '../../../../db/ethereum';
import { hancockDbError, hancockNotFoundError } from '../../../../models/error';
import {
  IEthereumContractAbiDbModel,
  IEthereumContractDbModel,
  IEthereumContractInstanceDbModel,
} from '../../../../models/ethereum';
import { error } from '../../../../utils/error';
import logger from '../../../../utils/logger';
import { hancockContractNotFoundError } from '../../models/error';
import { hancockContractAbiError, hancockContractConflictError } from '../models/error';
import * as ethereumScRegisterDomain from '../register';

jest.mock('../../../../db/ethereum');
jest.mock('../../../../utils/logger');
jest.mock('../../../../utils/error');

describe('ethereumScRegisterDomain', () => {

  const contractModelResponse: IEthereumContractDbModel | null = {
    abi: [],
    abiName: 'mockedAbiName',
    address: 'mockedAddress',
    alias: 'mockedAlias',
  } as any;

  describe('::_updateSmartContractVersion', () => {

    const dbContractMock: jest.Mock = (db.getSmartContractByAlias as any);
    const dbCountMock: jest.Mock = (db.getCountVersionsByAlias as any);
    const dbUpdateMock: jest.Mock = (db.updateSmartContractAlias as any);

    beforeEach(() => {

      dbContractMock.mockClear();
      dbCountMock.mockClear();
      dbUpdateMock.mockClear();

    });

    it('should update the alias version in ddbb', async () => {

      const alias: string = 'mockedAlias';
      dbContractMock.mockResolvedValueOnce(contractModelResponse);

      dbCountMock.mockResolvedValueOnce(10);

      const expectedResponse: WriteOpResult | void = {} as any;
      dbUpdateMock.mockResolvedValueOnce(expectedResponse);

      await ethereumScRegisterDomain._updateSmartContractVersion(alias);

      expect(dbContractMock).toHaveBeenCalledWith(alias);
      expect(dbCountMock).toHaveBeenCalledWith(alias);

      const expectedCallArg: string = `${alias}@11`;
      expect(dbUpdateMock).toHaveBeenCalledWith(alias, expectedCallArg);

    });

    it('should not update the alias version if the contractModel is not found ', async () => {

      const alias: string = 'mockedAlias';
      dbContractMock.mockResolvedValueOnce(null);

      try {

        await ethereumScRegisterDomain._updateSmartContractVersion(alias);
        fail('it should fail');
      } catch (error) {

        expect(error).toEqual(hancockContractNotFoundError);
        expect(dbContractMock).toHaveBeenCalledWith(alias);
        expect(dbCountMock).not.toHaveBeenCalled();
        expect(dbUpdateMock).not.toHaveBeenCalled();

      }

    });

    it('should not update the alias version if there are any error with the DB ', async () => {

      const alias: string = 'mockedAlias';
      dbContractMock.mockRejectedValueOnce(hancockDbError);

      try {

        await ethereumScRegisterDomain._updateSmartContractVersion(alias);
        fail('it should fail');
      } catch (error) {

        expect(error).toEqual(hancockDbError);
        expect(dbContractMock).toHaveBeenCalledWith(alias);
        expect(dbCountMock).not.toHaveBeenCalled();
        expect(dbUpdateMock).not.toHaveBeenCalled();

      }

    });

    it('should not update the alias version if there are any error with the DB 2 ', async () => {

      const alias: string = 'mockedAlias';
      dbContractMock.mockResolvedValueOnce(contractModelResponse);

      dbCountMock.mockRejectedValueOnce(hancockDbError);

      try {

        await ethereumScRegisterDomain._updateSmartContractVersion(alias);
        fail('it should fail');
      } catch (error) {

        expect(error).toEqual(hancockDbError);
        expect(dbContractMock).toHaveBeenCalledWith(alias);
        expect(dbUpdateMock).not.toHaveBeenCalled();

      }

    });

  });

  describe('::_updateAbiVersion', () => {

    const dbAbiMock: jest.Mock = (db.getAbiByName as any);
    const dbCountAbiMock: jest.Mock = (db.getCountVersionsAbiByName as any);
    const dbUpdateSmartConctracAbiMock: jest.Mock = (db.updateSmartContractAbiName as any);
    const dbUpdateAbiAliasMock: jest.Mock = (db.updateAbiAlias as any);
    beforeEach(() => {

      dbAbiMock.mockReset();
      dbCountAbiMock.mockReset();
      dbUpdateSmartConctracAbiMock.mockReset();
      dbUpdateAbiAliasMock.mockReset();

    });

    it('should update the abiName version in ddbb', async () => {

      const alias: string = 'mockedAlias';

      dbAbiMock.mockResolvedValueOnce(contractModelResponse);

      dbCountAbiMock.mockResolvedValueOnce(10);

      const expectedResponse: WriteOpResult | void = {} as any;
      dbUpdateSmartConctracAbiMock.mockResolvedValueOnce(expectedResponse);

      await ethereumScRegisterDomain._updateAbiVersion(alias);

      expect(dbAbiMock).toHaveBeenCalledWith(alias);
      expect(dbCountAbiMock).toHaveBeenCalledWith(alias);

      const expectedCallArg: string = `${alias}@11`;
      expect(dbUpdateSmartConctracAbiMock).toHaveBeenCalledWith(alias, expectedCallArg);

    });

    it('should not update the abiName version if the contractModel is not found ', async () => {

      const alias: string = 'mockedAlias';
      dbAbiMock.mockResolvedValueOnce(null);

      try {

        await ethereumScRegisterDomain._updateAbiVersion(alias);

      } catch (error) {

        expect(error).toEqual(hancockContractAbiError);
        expect(dbAbiMock).toHaveBeenCalledWith(alias);
        expect(dbCountAbiMock).not.toHaveBeenCalled();
        expect(dbUpdateSmartConctracAbiMock).not.toHaveBeenCalled();

      }

    });

    it('should not update the abiName version if there are any problem with DB ', async () => {

      const alias: string = 'mockedAlias';
      dbAbiMock.mockRejectedValueOnce(hancockDbError);

      try {

        await ethereumScRegisterDomain._updateAbiVersion(alias);

      } catch (error) {

        expect(error).toEqual(hancockDbError);
        expect(dbAbiMock).toHaveBeenCalledWith(alias);
        expect(dbCountAbiMock).not.toHaveBeenCalled();
        expect(dbUpdateSmartConctracAbiMock).not.toHaveBeenCalled();

      }

    });

    it('should not update the abiName version if there are any problem with DB 2', async () => {

      const alias: string = 'mockedAlias';
      dbAbiMock.mockResolvedValueOnce(contractModelResponse);

      dbCountAbiMock.mockRejectedValueOnce(hancockDbError);

      try {

        await ethereumScRegisterDomain._updateAbiVersion(alias);

      } catch (error) {

        expect(error).toEqual(hancockDbError);
        expect(dbAbiMock).toHaveBeenCalledWith(alias);
        expect(dbUpdateSmartConctracAbiMock).not.toHaveBeenCalled();

      }

    });

  });

  describe('::_retrieveSmartContractInstance', () => {

    const dbContractMock: jest.Mock = (db.getSmartContractByAddress as any);

    const address: string = 'mockedAddress';

    beforeEach(() => {

      jest.resetAllMocks();

    });

    it('should retrieve the smart contract model from ddbb by address', async () => {

      const instanceResult: IEthereumContractInstanceDbModel | null = {} as any;

      dbContractMock.mockResolvedValueOnce(instanceResult);

      const result: IEthereumContractInstanceDbModel | null = await (ethereumScRegisterDomain as any)._retrieveSmartContractInstance(address);

      expect(dbContractMock).toHaveBeenCalledWith(address);
      expect(result).toEqual(instanceResult);

    });

    it('should throw an exception if there are error checking contractModel existance in ddbb', async () => {

      dbContractMock.mockRejectedValue(new Error('Boom!'));

      try {

        await (ethereumScRegisterDomain as any)._retrieveSmartContractInstance(address);
        fail('It should fail');

      } catch (e) {

        expect(dbContractMock).toHaveBeenCalledWith(address);
        expect(logger.error).toHaveBeenCalled();

        expect(e).toEqual(hancockContractNotFoundError);

      }

    });

  });

  describe('::registerAbi', () => {

    // tslint:disable-next-line:variable-name
    let _updateAbiVersionMock: jest.SpyInstance;

    const dbInsertAbiMock: jest.Mock = (db.insertSmartContractAbi as any);

    const abiName: string = 'mockedAbiName';
    const abi: any[] = ['mockedAbi'];

    beforeAll(() => {

      _updateAbiVersionMock = jest.spyOn(ethereumScRegisterDomain, '_updateAbiVersion');

    });

    beforeEach(() => {

      jest.resetAllMocks();

    });

    it('should register a new abi versioning abis if it is necessary', async () => {

      const insertAbiResponse: InsertOneWriteOpResult = { result: { ok: true } } as any;

      _updateAbiVersionMock.mockResolvedValueOnce(insertAbiResponse);
      dbInsertAbiMock.mockResolvedValueOnce(insertAbiResponse);

      const result: any = await ethereumScRegisterDomain.registerAbi(abiName, abi);

      expect(_updateAbiVersionMock).toHaveBeenCalledWith(abiName);
      expect(dbInsertAbiMock).toHaveBeenCalledWith({ abi, name: abiName });
      expect(logger.info).toHaveBeenCalled();
      expect(result).toBeUndefined();

    });

  });

  describe('::registerInstance', () => {

    // tslint:disable-next-line:variable-name
    let _updateSmartContractVersionMock: jest.SpyInstance;
    // tslint:disable-next-line:variable-name
    let _retrieveSmartContractInstanceMock: jest.SpyInstance;

    const dbInsertMock: jest.Mock = (db.insertSmartContract as any);
    const dbGetAbiByNameMock: jest.Mock = (db.getAbiByName as any);

    const alias: string = 'mockedAlias';
    const address: string = 'mockedAddress';
    const abiName: string = 'mockedAbiName';

    beforeAll(() => {

      _updateSmartContractVersionMock = jest.spyOn(ethereumScRegisterDomain, '_updateSmartContractVersion');
      _retrieveSmartContractInstanceMock = jest.spyOn(ethereumScRegisterDomain, '_retrieveSmartContractInstance');

    });

    beforeEach(() => {

      jest.resetAllMocks();

    });

    it('should register a new contract instance versioning contract alias if it is necessary', async () => {

      const contractAbiModelResponseMock: IEthereumContractAbiDbModel | null = {} as any;
      const contractInstanceModelResponseMock: IEthereumContractInstanceDbModel | null = null;
      const insertResponseMock: InsertOneWriteOpResult = {
        result: {
          ok: 1,
        },
      } as any;

      _retrieveSmartContractInstanceMock.mockResolvedValueOnce(contractInstanceModelResponseMock);
      dbGetAbiByNameMock.mockResolvedValueOnce(contractAbiModelResponseMock);
      dbInsertMock.mockResolvedValueOnce(insertResponseMock);

      const result: any = await ethereumScRegisterDomain.registerInstance(alias, address, abiName);

      expect(_retrieveSmartContractInstanceMock).toHaveBeenCalledWith(address);
      expect(dbGetAbiByNameMock).toHaveBeenCalledWith(abiName);
      expect(_updateSmartContractVersionMock).toHaveBeenCalledWith(alias);
      expect(dbInsertMock).toHaveBeenCalledWith({ abiName, address, alias });
      expect(logger.info).toHaveBeenCalledWith(`Smart contract instance registered as ${alias}`);
      expect(result).toBeUndefined();

    });

    it('should throw an exception if the contractModel address is already registered', async () => {

      const contractInstanceModelResponseMock: IEthereumContractInstanceDbModel | null = {} as any;

      _retrieveSmartContractInstanceMock.mockResolvedValueOnce(contractInstanceModelResponseMock);

      try {

        await ethereumScRegisterDomain.registerInstance(alias, address, abiName);
        fail('It should fail');

      } catch (e) {

        expect(_retrieveSmartContractInstanceMock).toHaveBeenCalledWith(address);
        expect(dbGetAbiByNameMock).not.toHaveBeenCalled();
        expect(_updateSmartContractVersionMock).not.toHaveBeenCalled();
        expect(dbInsertMock).not.toHaveBeenCalled();
        expect(logger.error).toHaveBeenCalled();

        expect(e).toEqual(hancockContractConflictError);

      }

    });

    it('should throw an exception if there is no abi identified by the abiName', async () => {

      const contractAbiModelResponseMock: IEthereumContractAbiDbModel | null = null as any;
      const contractInstanceModelResponseMock: IEthereumContractInstanceDbModel | null = null as any;

      _retrieveSmartContractInstanceMock.mockResolvedValueOnce(contractInstanceModelResponseMock);
      dbGetAbiByNameMock.mockResolvedValueOnce(contractAbiModelResponseMock);

      try {

        await ethereumScRegisterDomain.registerInstance(alias, address, abiName);
        fail('It should fail');

      } catch (e) {

        expect(_retrieveSmartContractInstanceMock).toHaveBeenCalledWith(address);
        expect(dbGetAbiByNameMock).toHaveBeenCalledWith(abiName);
        expect(_updateSmartContractVersionMock).not.toHaveBeenCalled();
        expect(dbInsertMock).not.toHaveBeenCalled();
        expect(logger.error).toHaveBeenCalled();

        expect(e).toEqual(hancockContractAbiError);

      }

    });

  });

  describe('::register', () => {

    // tslint:disable-next-line:variable-name
    let _retrieveSmartContractInstanceMock: jest.SpyInstance;

    let registerInstanceMock: jest.SpyInstance;
    let registerAbiMock: jest.SpyInstance;

    const alias: string = 'mockedAlias';
    const address: string = 'mockedAddress';
    const abi: any[] = ['mockedAbi'];

    beforeEach(() => {

      jest.restoreAllMocks();

      _retrieveSmartContractInstanceMock = jest.spyOn(ethereumScRegisterDomain, '_retrieveSmartContractInstance');
      registerInstanceMock = jest.spyOn(ethereumScRegisterDomain, 'registerInstance');
      registerAbiMock = jest.spyOn(ethereumScRegisterDomain, 'registerAbi');

      registerInstanceMock.mockResolvedValueOnce(undefined);
      registerAbiMock.mockResolvedValueOnce(undefined);

    });

    it('should insert a new contractModel in ddbb if it does not exist yet and update the previous aliased one (only instance referencing abi)', async () => {

      const abiName: string = 'mockedAbiName';

      const result: any = await ethereumScRegisterDomain.register(alias, address, abi, abiName);

      expect(registerInstanceMock).toHaveBeenCalledWith(alias, address, abiName);
      expect(registerAbiMock).not.toHaveBeenCalled();
      expect(result).toBeUndefined();

    });

    it('should insert a new contractModel in ddbb if it does not exist yet and update the previous aliased one (new instance and abi)', async () => {

      const contractInstanceModelResponseMock: IEthereumContractInstanceDbModel | null = null;

      _retrieveSmartContractInstanceMock.mockResolvedValueOnce(contractInstanceModelResponseMock);

      const result: any = await ethereumScRegisterDomain.register(alias, address, abi);

      expect(_retrieveSmartContractInstanceMock).toHaveBeenCalledWith(address);
      expect(registerAbiMock).toHaveBeenCalledWith(alias, abi);
      expect(registerInstanceMock).toHaveBeenCalledWith(alias, address, alias);
      expect(result).toBeUndefined();

    });

    it('should throw an exception if the contractModel address is already registered', async () => {

      const contractInstanceModelResponseMock: IEthereumContractInstanceDbModel | null = {} as any;

      _retrieveSmartContractInstanceMock.mockResolvedValueOnce(contractInstanceModelResponseMock);

      try {

        await ethereumScRegisterDomain.register(alias, address, abi);
        fail('It should fail');

      } catch (e) {

        expect(_retrieveSmartContractInstanceMock).toHaveBeenCalledWith(address);
        expect(registerAbiMock).not.toHaveBeenCalled();
        expect(registerInstanceMock).not.toHaveBeenCalled();
        expect(logger.error).toHaveBeenCalled();

        expect(e).toEqual(hancockContractConflictError);

      }

    });

  });

});
