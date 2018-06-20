import { Collection, InsertOneWriteOpResult } from 'mongodb';
import {
  EthereumSmartContractInternalServerErrorResponse,
  IEthereumContractDbModel,
} from '../../../models/ethereum/smartContract';
import { EthereumSmartContractConflictResponse } from '../../../models/ethereum/smartContract';

export async function register(alias: string, address: string, abi: string): Promise<void> {

  const db: any = DB.get();
  const collection: Collection = db.collection(CONF.db.ethereum.collections.smartContracts);

  try {

    const addressResult: IEthereumContractDbModel = await collection.findOne({ address });

    if (!addressResult) {

      const aliasResult: IEthereumContractDbModel = await collection.findOne({ alias });

      if (aliasResult) {

        const numVersions = await collection.count({ alias: { $regex: `^${alias}@` } });
        const newAlias = `${alias}@${numVersions + 1}`;

        await collection.update({ alias }, { $set: { alias: newAlias } });

      }

      const insert: InsertOneWriteOpResult = await collection.insertOne({
        abi,
        address,
        alias,
      });

      if (insert && insert.result.ok) {

        LOG.info(`Smart contract registered as ${alias}`);

      }

    } else {

      throw EthereumSmartContractConflictResponse;

    }

  } catch (e) {

    LOG.error(`Smart contract ${alias} cannot be registered: ${e}`);
    throw EthereumSmartContractInternalServerErrorResponse;

  }
}
