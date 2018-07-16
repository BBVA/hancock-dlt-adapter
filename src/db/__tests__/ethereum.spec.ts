import 'jest';
import { AggregationCursor, Collection } from '../../../../kst-hancock-ms-dlt-broker/node_modules/@types/mongodb';
import { IEthereumContractAbiDbModel, IEthereumContractInstanceDbModel } from '../../models/ethereum';
import * as db from '../../utils/db';
import * as utils from '../../utils/utils';
import * as ethereumDb from '../ethereum';

jest.mock('../../utils/config');
jest.mock('../../utils/db');
jest.mock('../../utils/utils');
jest.mock('mongodb');

describe('dbEthereum', async () => {

  it('::getCollection should return the mongodb collection successfully', async () => {

    const getDbMock = (db.getDb as jest.Mock);
    const dbClientMock = ((db as any).__client__);

    await ethereumDb._getCollection('whateverCollectionToRetrieve');

    expect(getDbMock).toHaveBeenCalled();
    expect(getDbMock).toHaveBeenCalledWith('mockDatabase');

    expect(dbClientMock.collection).toHaveBeenCalled();
    expect(dbClientMock.collection).toHaveBeenCalledWith('whateverCollectionToRetrieve');

  });

  describe('_aggregateCollections', async () => {

    it('::should return the mongodb aggregationCursor successfully filtering by query', async () => {

      const collMock: Collection = ((db as any).__collection__);
      const cursorMock: AggregationCursor = ((db as any).__aggregationCursor__);
      const queryMock: any = {};

      const result = await ethereumDb._aggregateCollections(collMock, queryMock);

      expect(collMock.aggregate).toHaveBeenCalled();
      expect(result).toEqual(cursorMock);

      const firstCallArg = (collMock.aggregate as jest.Mock).mock.calls[0][0];
      expect(firstCallArg[0]).toHaveProperty('$match', queryMock);

    });

    it('::should return the mongodb aggregationCursor successfully without filter', async () => {

      const collMock: Collection = ((db as any).__collection__);
      const cursorMock: AggregationCursor = ((db as any).__aggregationCursor__);

      const result = await ethereumDb._aggregateCollections(collMock);

      expect(collMock.aggregate).toHaveBeenCalled();
      expect(result).toEqual(cursorMock);

      const firstCallArg = (collMock.aggregate as jest.Mock).mock.calls[0][0];
      expect(firstCallArg).not.toHaveProperty('$match');

    });

  });

  describe('with contracts collection', async () => {

    let getCollMock: jest.Mock;
    let aggregateCollMock: jest.Mock;

    let coll: any;
    let cursor: any;
    let getScQuery: jest.Mock;
    const collNameInstances: string = 'mockDatabaseCollectionContractInstances';
    const collNameAbis: string = 'mockDatabaseCollectionContractAbis';

    beforeAll(() => {

      coll = ((db as any).__collection__);
      cursor = ((db as any).__aggregationCursor__);

      getCollMock = jest.spyOn(ethereumDb, '_getCollection').mockResolvedValue(coll);
      aggregateCollMock = jest.spyOn(ethereumDb, '_aggregateCollections').mockReturnValue(cursor);
      // getCollMock = (ethereumDb._getCollection as jest.Mock);
      // aggregateCollMock = (ethereumDb._aggregateCollections as jest.Mock);

      getScQuery = (utils.getScQueryByAddressOrAlias as jest.Mock);

    });

    beforeEach(() => {

      jest.clearAllMocks();

    });

    it('::getAllSmartContracts should call getCollection and call dbClient.find with params', async () => {

      await ethereumDb.getAllSmartContracts();

      expect(getCollMock).toHaveBeenCalledWith(collNameInstances);
      expect(aggregateCollMock).toHaveBeenCalledWith(coll);
      expect(cursor.toArray).toHaveBeenCalled();

    });

    it('::getSmartContractByAddressOrAlias should call getCollection and call dbClient.findOne with params', async () => {

      const mockedAddressOrAlias: string = 'mockAddressOrAlias';
      const mockedQuery: any = {};
      getScQuery.mockReturnValue(mockedQuery);

      await ethereumDb.getSmartContractByAddressOrAlias(mockedAddressOrAlias);

      expect(getCollMock).toHaveBeenCalledWith(collNameInstances);
      expect(getScQuery).toHaveBeenCalledWith(mockedAddressOrAlias);
      expect(aggregateCollMock).toHaveBeenCalledWith(coll, mockedQuery);
      expect(cursor.next).toHaveBeenCalled();

    });

    it('::getSmartContractByAddress should call getCollection and call dbClient.findOne with params', async () => {

      const mockedAddress: string = 'mockAddress';

      await ethereumDb.getSmartContractByAddress(mockedAddress);

      expect(getCollMock).toHaveBeenCalledWith(collNameInstances);
      expect(aggregateCollMock).toHaveBeenCalledWith(coll, { address: mockedAddress });
      expect(cursor.next).toHaveBeenCalled();

    });

    it('::getSmartContractByAlias should call getCollection and call dbClient.findOne with params', async () => {

      const mockedAlias: string = 'mockAlias';

      await ethereumDb.getSmartContractByAlias(mockedAlias);

      expect(getCollMock).toHaveBeenCalledWith(collNameInstances);
      expect(aggregateCollMock).toHaveBeenCalledWith(coll, { alias: mockedAlias });
      expect(cursor.next).toHaveBeenCalled();

    });

    it('::getAbiByName should call getCollection and call dbClient.findOne with params', async () => {

      const mockedAlias: string = 'mockAlias';

      await ethereumDb.getAbiByName(mockedAlias);

      expect(getCollMock).toHaveBeenCalledWith(collNameAbis);
      expect(aggregateCollMock).toHaveBeenCalledWith(coll, { name: mockedAlias });
      expect(cursor.next).toHaveBeenCalled();

    });

    it('::getInstanceByAddressOrAlias should call getCollection and call dbClient.findOne with params', async () => {

      const mockedAddressOrAlias: string = 'mockedAddressOrAlias';
      const mockedQuery: any = {};
      getScQuery.mockReturnValue(mockedQuery);

      await ethereumDb.getInstanceByAddressOrAlias(mockedAddressOrAlias);

      expect(getCollMock).toHaveBeenCalledWith(collNameInstances);
      expect(getScQuery).toHaveBeenCalledWith(mockedAddressOrAlias);
      expect(coll.findOne).toHaveBeenCalledWith(mockedQuery);

    });

    it('::getInstanceByAddress should call getCollection and call dbClient.findOne with params', async () => {

      const mockedAddress: string = 'mockedAddress';

      await ethereumDb.getInstanceByAddress(mockedAddress);

      expect(getCollMock).toHaveBeenCalledWith(collNameInstances);
      expect(coll.findOne).toHaveBeenCalledWith({ address: mockedAddress });

    });

    it('::getInstanceByAlias should call getCollection and call dbClient.findOne with params', async () => {

      const mockedAlias: string = 'mockedAlias';

      await ethereumDb.getInstanceByAlias(mockedAlias);

      expect(getCollMock).toHaveBeenCalledWith(collNameInstances);
      expect(coll.findOne).toHaveBeenCalledWith({ alias: mockedAlias });

    });

    it('::deleteSmartContractByAddressOrAlias should call getCollection and call dbClient.findOneAndDelete with params', async () => {

      const mockedAddressOrAlias: string = 'mockAddressOrAlias';
      const mockedQuery: any = {};
      getScQuery.mockReturnValue(mockedQuery);

      await ethereumDb.deleteSmartContractByAddressOrAlias(mockedAddressOrAlias);

      expect(getCollMock).toHaveBeenCalledWith(collNameInstances);
      expect(getScQuery).toHaveBeenCalledWith(mockedAddressOrAlias);
      expect(coll.findOneAndDelete).toHaveBeenCalledWith(mockedQuery);

    });

    it('::getCountVersionsByAlias should call getCollection and call dbClient.findOne with params', async () => {

      const mockedAlias: string = 'mockAlias';

      await ethereumDb.getCountVersionsByAlias(mockedAlias);

      expect(getCollMock).toHaveBeenCalledWith(collNameInstances);
      expect(coll.count).toHaveBeenCalledWith({ alias: { $regex: `^${mockedAlias}@` } });

    });

    it('::getCountVersionsAbiByName should call getCollection and call dbClient.findOne with params', async () => {

      const mockedAlias: string = 'mockAlias';

      await ethereumDb.getCountVersionsAbiByName(mockedAlias);

      expect(getCollMock).toHaveBeenCalledWith(collNameAbis);
      expect(coll.count).toHaveBeenCalledWith({ name: { $regex: `^${mockedAlias}@` } });

    });

    it('::updateSmartContractAlias should call getCollection and call dbClient.findOne with params', async () => {

      const mockedAlias: string = 'mockAlias';
      const mockedNewAlias: string = 'mockNewAlias';

      await ethereumDb.updateSmartContractAlias(mockedAlias, mockedNewAlias);

      expect(getCollMock).toHaveBeenCalledWith(collNameInstances);
      expect(coll.update).toHaveBeenCalledWith({ alias: mockedAlias }, { $set: { alias: mockedNewAlias } });

    });

    it('::updateSmartContractAbiName should call getCollection and call dbClient.findOne with params', async () => {

      const mockedAlias: string = 'mockAlias';
      const mockedNewAlias: string = 'mockNewAlias';

      await ethereumDb.updateSmartContractAbiName(mockedAlias, mockedNewAlias);

      expect(getCollMock).toHaveBeenCalledWith(collNameInstances);
      expect(coll.update).toHaveBeenCalledWith({ abiName: mockedAlias }, { $set: { abiName: mockedNewAlias } });

    });

    it('::updateAbiAlias should call getCollection and call dbClient.findOne with params', async () => {

      const mockedAlias: string = 'mockAlias';
      const mockedNewAlias: string = 'mockNewAlias';

      await ethereumDb.updateAbiAlias(mockedAlias, mockedNewAlias);

      expect(getCollMock).toHaveBeenCalledWith(collNameAbis);
      expect(coll.update).toHaveBeenCalledWith({ name: mockedAlias }, { $set: { name: mockedNewAlias } });

    });

    it('::insertSmartContract should call getCollection and call dbClient.findOne with params', async () => {

      const mockedContract: IEthereumContractInstanceDbModel = {} as any;

      await ethereumDb.insertSmartContract(mockedContract);

      expect(getCollMock).toHaveBeenCalledWith(collNameInstances);
      expect(coll.insertOne).toHaveBeenCalledWith(mockedContract);

    });

    it('::insertSmartContractAbi should call getCollection and call dbClient.findOne with params', async () => {

      const mockedAbiModel: IEthereumContractAbiDbModel = {} as any;

      await ethereumDb.insertSmartContractAbi(mockedAbiModel);

      expect(getCollMock).toHaveBeenCalledWith(collNameAbis);
      expect(coll.insertOne).toHaveBeenCalledWith(mockedAbiModel);

    });

    it('::deleteSmartContracAbiByName should call getCollection and call dbClient.findOneAndDelete with params', async () => {

      const mockedName: string = 'mockedAbiName';

      await ethereumDb.deleteSmartContracAbiByName(mockedName);

      expect(getCollMock).toHaveBeenCalledWith(collNameAbis);
      expect(coll.findOneAndDelete).toHaveBeenCalledWith({ name: mockedName });

    });

  });

});
