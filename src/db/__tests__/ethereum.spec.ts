import 'jest';
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

    expect(getDbMock.mock.calls.length).toBe(1);
    expect(getDbMock.mock.calls).toEqual([['mockDatabase']]);

    expect(dbClientMock.collection.mock.calls.length).toBe(1);
    expect(dbClientMock.collection.mock.calls).toEqual([['whateverCollectionToRetrieve']]);

  });

  describe('with contracts collection', async () => {

    let getColl: jest.Mock;
    let coll: any;
    let getScQuery: jest.Mock;
    const collName: string = 'mockDatabaseCollectionContracts';

    beforeAll(() => {

      coll = ((db as any).__collection__);

      (ethereumDb._getCollection as any) = jest.fn().mockResolvedValue(coll);
      getColl = (ethereumDb._getCollection as jest.Mock);

      getScQuery = (utils.getScQueryByAddressOrAlias as jest.Mock);

    });

    beforeEach(() => {

      jest.clearAllMocks();

    });

    it('::getAllSmartContracts should call getCollection and call dbClient.find with params', async () => {

      await ethereumDb.getAllSmartContracts();

      expect(getColl).toHaveBeenCalledTimes(1);
      expect(getColl).toHaveBeenCalledWith(collName);

      expect(coll.find).toHaveBeenCalledTimes(1);
      expect(coll.find).toHaveBeenCalledWith({});
      expect(coll.toArray).toHaveBeenCalledTimes(1);

    });

    it('::getSmartContractByAddressOrAlias should call getCollection and call dbClient.findOne with params', async () => {

      const mockedAddressOrAlias: string = 'mockAddressOrAlias';
      const mockedQuery: any = {};
      getScQuery.mockReturnValue(mockedQuery);

      await ethereumDb.getSmartContractByAddressOrAlias(mockedAddressOrAlias);

      expect(getColl).toHaveBeenCalledWith(collName);
      expect(getScQuery).toHaveBeenCalledWith(mockedAddressOrAlias);
      expect(coll.findOne).toHaveBeenCalledWith(mockedQuery);

    });

    it('::getSmartContractByAddress should call getCollection and call dbClient.findOne with params', async () => {

      const mockedAddress: string = 'mockAddress';

      await ethereumDb.getSmartContractByAddress(mockedAddress);

      expect(getColl).toHaveBeenCalledWith(collName);
      expect(coll.findOne).toHaveBeenCalledWith({ address: mockedAddress });

    });

    it('::getSmartContractByAlias should call getCollection and call dbClient.findOne with params', async () => {

      const mockedAlias: string = 'mockAlias';

      await ethereumDb.getSmartContractByAlias(mockedAlias);

      expect(getColl).toHaveBeenCalledWith(collName);
      expect(coll.findOne).toHaveBeenCalledWith({ alias: mockedAlias });

    });

    it('::deleteSmartContractByAddressOrAlias should call getCollection and call dbClient.findOne with params', async () => {

      const mockedAddressOrAlias: string = 'mockAddressOrAlias';
      const mockedQuery: any = {};
      getScQuery.mockReturnValue(mockedQuery);

      await ethereumDb.deleteSmartContractByAddressOrAlias(mockedAddressOrAlias);

      expect(getColl).toHaveBeenCalledWith(collName);
      expect(getScQuery).toHaveBeenCalledWith(mockedAddressOrAlias);
      expect(coll.findOneAndDelete).toHaveBeenCalledWith(mockedQuery);

    });

    it('::getCountVersionsByAlias should call getCollection and call dbClient.findOne with params', async () => {

      const mockedAlias: string = 'mockAlias';

      await ethereumDb.getCountVersionsByAlias(mockedAlias);

      expect(getColl).toHaveBeenCalledWith(collName);
      expect(coll.count).toHaveBeenCalledWith({ alias: { $regex: `^${mockedAlias}@` } });

    });

    it('::updateSmartContractAlias should call getCollection and call dbClient.findOne with params', async () => {

      const mockedAlias: string = 'mockAlias';
      const mockedNewAlias: string = 'mockNewAlias';

      await ethereumDb.updateSmartContractAlias(mockedAlias, mockedNewAlias);

      expect(getColl).toHaveBeenCalledWith(collName);
      expect(coll.update).toHaveBeenCalledWith({ alias: mockedAlias }, { $set: { alias: mockedNewAlias } });

    });

    it('::insertSmartContract should call getCollection and call dbClient.findOne with params', async () => {

      const mockedContract: any = {};

      await ethereumDb.insertSmartContract(mockedContract);

      expect(getColl).toHaveBeenCalledWith(collName);
      expect(coll.insertOne).toHaveBeenCalledWith(mockedContract);

    });

  });

});
