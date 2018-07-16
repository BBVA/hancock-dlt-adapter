import { AggregationCursor, Collection, Db, FindAndModifyWriteOpResultObject, InsertOneWriteOpResult, WriteOpResult } from 'mongodb';
import { IEthereumContractAbiDbModel, IEthereumContractDbModel, IEthereumContractInstanceDbModel } from '../models/ethereum';
import config from '../utils/config';
import * as db from '../utils/db';
import { getScQueryByAddressOrAlias } from '../utils/utils';

const database: string = config.db.ethereum.database;
const contractsInstancesCollection: string = config.db.ethereum.collections.contractInstances;
const contractsAbisCollection: string = config.db.ethereum.collections.contractAbis;

// tslint:disable-next-line:variable-name
export const _getCollection = async (collection: string): Promise<Collection> => {
  return await db.getDb(database).then((client: Db) => client.collection(collection));
};

// tslint:disable-next-line:variable-name
export const _aggregateCollections = (coll: Collection, query?: any): AggregationCursor<any> => {

  const stages: any[] = [
    {
      $lookup: {
        as: 'abiJoin',
        foreignField: 'name',
        from: contractsAbisCollection,
        localField: 'abiName',
      },
    },
    {
      $replaceRoot: { newRoot: { $mergeObjects: [{ $arrayElemAt: ['$abiJoin', 0] }, '$$ROOT'] } },
    },
    { $project: { abiJoin: 0, _id: 0, name: 0 } },
  ];

  if (query) {
    stages.unshift({ $match: query });
  }

  return coll.aggregate(stages);
};

export async function getAllSmartContracts(): Promise<IEthereumContractDbModel[]> {

  const coll: Collection = await _getCollection(contractsInstancesCollection);

  return _aggregateCollections(coll).toArray();

}

export async function getSmartContractByAddressOrAlias(addressOrAlias: string): Promise<IEthereumContractDbModel | null> {

  const coll: Collection = await _getCollection(contractsInstancesCollection);

  const query: any = getScQueryByAddressOrAlias(addressOrAlias);

  return _aggregateCollections(coll, query).next();

}

export async function getSmartContractByAddress(address: string): Promise<IEthereumContractDbModel | null> {

  const coll: Collection = await _getCollection(contractsInstancesCollection);

  return _aggregateCollections(coll, { address }).next();

}

export async function getSmartContractByAlias(alias: string): Promise<IEthereumContractDbModel | null> {

  const coll: Collection = await _getCollection(contractsInstancesCollection);

  return _aggregateCollections(coll, { alias }).next();

}

export async function getAbiByName(name: string): Promise<IEthereumContractAbiDbModel | null> {

  const coll: Collection = await _getCollection(contractsAbisCollection);

  return _aggregateCollections(coll, { name }).next();

}

export async function getInstanceByAddressOrAlias(addressOrAlias: string): Promise<IEthereumContractInstanceDbModel | null> {

  const coll: Collection = await _getCollection(contractsInstancesCollection);

  const query: any = getScQueryByAddressOrAlias(addressOrAlias);

  return coll.findOne(query);

}

export async function getInstanceByAddress(address: string): Promise<IEthereumContractInstanceDbModel | null> {

  const coll: Collection = await _getCollection(contractsInstancesCollection);

  return coll.findOne({ address });

}

export async function getInstanceByAlias(alias: string): Promise<IEthereumContractInstanceDbModel | null> {

  const coll: Collection = await _getCollection(contractsInstancesCollection);

  return coll.findOne({ alias });

}

export async function deleteSmartContractByAddressOrAlias(addressOrAlias: string): Promise<FindAndModifyWriteOpResultObject> {

  const coll: Collection = await _getCollection(contractsInstancesCollection);

  const query: any = getScQueryByAddressOrAlias(addressOrAlias);

  return coll.findOneAndDelete(query);

}

export async function getCountVersionsByAlias(alias: string): Promise<number> {

  const coll: Collection = await _getCollection(contractsInstancesCollection);

  return coll.count({ alias: { $regex: `^${alias}@` } });

}

export async function getCountVersionsAbiByName(name: string): Promise<number> {

  const coll: Collection = await _getCollection(contractsAbisCollection);

  return coll.count({ name: { $regex: `^${name}@` } });

}

export async function updateSmartContractAlias(alias: string, newAlias: string): Promise<WriteOpResult> {

  const coll: Collection = await _getCollection(contractsInstancesCollection);

  return coll.update({ alias }, { $set: { alias: newAlias } });

}

export async function updateSmartContractAbiName(name: string, newName: string): Promise<WriteOpResult> {

  const coll: Collection = await _getCollection(contractsInstancesCollection);

  return coll.update({ abiName: name }, { $set: { abiName: newName } });

}

export async function updateAbiAlias(name: string, newName: string): Promise<WriteOpResult> {

  const coll: Collection = await _getCollection(contractsAbisCollection);

  return coll.update({ name }, { $set: { name: newName } });

}

export async function insertSmartContract(contractInstanceModel: IEthereumContractInstanceDbModel): Promise<InsertOneWriteOpResult> {

  const coll: Collection = await _getCollection(contractsInstancesCollection);

  return coll.insertOne(contractInstanceModel);

}

export async function insertSmartContractAbi(contractAbiModel: IEthereumContractAbiDbModel): Promise<InsertOneWriteOpResult> {

  const coll: Collection = await _getCollection(contractsAbisCollection);

  return coll.insertOne(contractAbiModel);

}

export async function deleteSmartContracAbiByName(name: string): Promise<FindAndModifyWriteOpResultObject> {

  const coll: Collection = await _getCollection(contractsAbisCollection);

  return coll.findOneAndDelete({ name });

}
