import { Collection, Db, FindAndModifyWriteOpResultObject, InsertOneWriteOpResult, WriteOpResult } from 'mongodb';
import { getScQueryByAddressOrAlias } from '../components/utils';
import { IEthereumContractDbModel } from '../models/ethereum';
import config from '../utils/config';
import * as db from '../utils/db';

const database: string = config.db.ethereum.database;
const contractsCollection: string = config.db.ethereum.collections.contracts;

async function getCollection(collection: string): Promise<Collection> {
  return await db.getDb(database).then((client: Db) => client.collection(collection));
}

export async function getAllSmartContracts(): Promise<IEthereumContractDbModel[]> {

  const coll: Collection = await getCollection(contractsCollection);

  return coll
    .find({})
    .toArray();

}

// tslint:disable-next-line:max-line-length
export async function getSmartContractByAddressOrAlias(addressOrAlias: string): Promise<IEthereumContractDbModel | null> {

  const coll: Collection = await getCollection(contractsCollection);

  const query: any = getScQueryByAddressOrAlias(addressOrAlias);

  return coll.findOne(query);

}

export async function getSmartContractByAddress(address: string): Promise<IEthereumContractDbModel | null> {

  const coll: Collection = await getCollection(contractsCollection);

  return coll.findOne({ address });

}

export async function getSmartContractByAlias(alias: string): Promise<IEthereumContractDbModel | null> {

  const coll: Collection = await getCollection(contractsCollection);

  return coll.findOne({ alias });

}

// tslint:disable-next-line:max-line-length
export async function deleteSmartContractByAddressOrAlias(addressOrAlias: string): Promise<FindAndModifyWriteOpResultObject> {

  const coll: Collection = await getCollection(contractsCollection);

  const query: any = getScQueryByAddressOrAlias(addressOrAlias);

  return coll.findOneAndDelete(query);

}

export async function getCountVersionsByAlias(alias: string): Promise<number> {

  const coll: Collection = await getCollection(contractsCollection);

  return coll.count({ alias: { $regex: `^${alias}@` } });

}

export async function updateSmartContractAlias(alias: string, newAlias: string): Promise<WriteOpResult> {

  const coll: Collection = await getCollection(contractsCollection);

  return coll.update({ alias }, { $set: { alias: newAlias } });

}

export async function insertSmartContract(contract: IEthereumContractDbModel): Promise<InsertOneWriteOpResult> {

  const coll: Collection = await getCollection(contractsCollection);

  return coll.insertOne(contract);

}
