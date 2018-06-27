import 'jest';
import { InsertOneWriteOpResult, WriteOpResult } from 'mongodb';
import * as db from '../../../../db/ethereum';
import { EthereumSmartContractConflictResponse, EthereumSmartContractInternalServerErrorResponse, IEthereumContractDbModel } from '../../../../models/ethereum';
import * as ethereumScRegisterDomain from '../register';

jest.mock('../../../../db/ethereum');

describe('ethereumScRegisterDomain', () => {

  describe('::_updateSmartContractVersion', () => {

    const dbContractMock: jest.Mock = (db.getSmartContractByAlias as any);
    const dbCountMock: jest.Mock = (db.getCountVersionsByAlias as any);
    const dbUpdateMock: jest.Mock = (db.updateSmartContractAlias as any);

    beforeEach(() => {

      dbContractMock.mockReset();
      dbCountMock.mockReset();
      dbUpdateMock.mockReset();

    });

    it('should update the alias version in ddbb', async () => {

      const alias: string = 'mockedAlias';

      const contracModelResponse: IEthereumContractDbModel | null = {} as any;
      dbContractMock.mockResolvedValue(contracModelResponse);

      dbCountMock.mockResolvedValue(10);

      const expectedResponse: WriteOpResult | void = {} as any;
      dbUpdateMock.mockResolvedValue(expectedResponse);

      await ethereumScRegisterDomain._updateSmartContractVersion(alias);

      expect(dbContractMock).toHaveBeenCalledWith(alias);
      expect(dbCountMock).toHaveBeenCalledWith(alias);

      const expectedCallArg: string = `${alias}@11`;
      expect(dbUpdateMock).toHaveBeenCalledWith(alias, expectedCallArg);

    });

    it('should not update the alias version if the contractModel is not found ', async () => {

      const alias: string = 'mockedAlias';
      dbContractMock.mockResolvedValue(null);

      await ethereumScRegisterDomain._updateSmartContractVersion(alias);

      expect(dbContractMock).toHaveBeenCalledWith(alias);
      expect(dbCountMock).not.toHaveBeenCalled();
      expect(dbUpdateMock).not.toHaveBeenCalled();

    });

  });

  describe('::register', () => {

    // tslint:disable-next-line:variable-name
    let _updateSmartContractVersionMock: jest.Mock;
    const dbContractMock: jest.Mock = (db.getSmartContractByAddress as any);
    const dbInsertMock: jest.Mock = (db.insertSmartContract as any);

    const alias: string = 'mockedAlias';
    const address: string = 'mockedAddress';
    const abi: any[] = ['mockedAbi'];

    beforeAll(() => {

      (ethereumScRegisterDomain._updateSmartContractVersion as any) = jest.fn();
      _updateSmartContractVersionMock = (ethereumScRegisterDomain._updateSmartContractVersion as any);

    });

    beforeEach(() => {

      dbContractMock.mockReset();
      dbInsertMock.mockReset();
      _updateSmartContractVersionMock.mockReset();

    });

    it('should instert a new contractModel in ddbb if it does not exist yet and update the previous aliased one', async () => {

      const contractModelResponseMock: IEthereumContractDbModel | null = null;
      const insertResponseMock: InsertOneWriteOpResult = {
        result: {
          ok: 1,
        },
      } as any;

      dbContractMock.mockResolvedValue(contractModelResponseMock);
      dbInsertMock.mockResolvedValue(insertResponseMock);

      const result: any = await ethereumScRegisterDomain.register(alias, address, abi);

      expect(dbContractMock).toHaveBeenCalledWith(address);
      expect(_updateSmartContractVersionMock).toHaveBeenCalledWith(alias);
      expect(dbInsertMock).toHaveBeenCalledWith({ abi, address, alias });
      expect(LOG.info).toHaveBeenCalledWith(`Smart contract registered as ${alias}`);
      expect(result).toBeUndefined();

    });

    it('should throw an exception if the contractModel address is already registered', async () => {

      const contractModelResponseMock: IEthereumContractDbModel | null = {} as any;

      dbContractMock.mockResolvedValue(contractModelResponseMock);

      try {

        await ethereumScRegisterDomain.register(alias, address, abi);
        fail('It should fail');

      } catch (e) {

        expect(dbContractMock).toHaveBeenCalledWith(address);
        expect(_updateSmartContractVersionMock).not.toHaveBeenCalled();
        expect(dbInsertMock).not.toHaveBeenCalled();
        expect(LOG.error).toHaveBeenCalled();

        expect(e).toEqual(EthereumSmartContractConflictResponse);

      }

    });

    it('should throw an exception if there are error checking contractModel existance in ddbb', async () => {

      dbContractMock.mockRejectedValue(new Error('Boom!'));

      try {

        await ethereumScRegisterDomain.register(alias, address, abi);
        fail('It should fail');

      } catch (e) {

        expect(dbContractMock).toHaveBeenCalledWith(address);
        expect(LOG.error).toHaveBeenCalled();

        expect(e).toEqual(EthereumSmartContractInternalServerErrorResponse);

      }

    });

  });

});
