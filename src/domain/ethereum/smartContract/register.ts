import { InsertOneWriteOpResult, WriteOpResult } from 'mongodb';
import * as db from '../../../db/ethereum';
import {
  EthereumSmartContractConflictResponse,
  EthereumSmartContractInternalServerErrorResponse,
  IEthereumContractDbModel,
} from '../../../models/ethereum/smartContract';

export async function register(alias: string, address: string, abi: any[]): Promise<void> {

  let addressResult: IEthereumContractDbModel | null;

  try {

    addressResult = await db.getSmartContractByAddress(address);

  } catch (e) {

    LOG.error(`Smart contract ${alias} cannot be registered: ${e}`);
    throw EthereumSmartContractInternalServerErrorResponse;

  }

  if (!addressResult) {

    await _updateSmartContractVersion(alias);

    const insert: InsertOneWriteOpResult = await db.insertSmartContract({
      abi,
      address,
      alias,
    });

    if (insert && insert.result.ok) {

      LOG.info(`Smart contract registered as ${alias}`);

    }

  } else {

    LOG.error(`Smart contract ${alias} cannot be registered due to a conflict`);
    throw EthereumSmartContractConflictResponse;

  }

}

// tslint:disable-next-line:variable-name
export const _updateSmartContractVersion = async (alias: string): Promise<WriteOpResult | void> => {

  const aliasResult: IEthereumContractDbModel | null = await db.getSmartContractByAlias(alias);

  if (aliasResult) {

    const numVersions: number = await db.getCountVersionsByAlias(alias);
    const newAlias: string = `${alias}@${numVersions + 1}`;

    await db.updateSmartContractAlias(alias, newAlias);

  }
};
