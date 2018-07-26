import { InsertOneWriteOpResult, WriteOpResult } from 'mongodb';
import * as db from '../../../db/ethereum';
import {
  ethereumSmartContractAbiNameNotFoundResponse,
  ethereumSmartContractConflictResponse,
  ethereumSmartContractInternalServerErrorResponse,
  IEthereumContractAbiDbModel,
  IEthereumContractDbModel,
  IEthereumContractInstanceDbModel,
} from '../../../models/ethereum/smartContract';
import * as logger from '../../../utils/logger';

const LOG = logger.getLogger();

export async function register(alias: string, address: string, abi: any[], abiName?: string): Promise<void> {

  if (abiName) {

    await registerInstance(alias, address, abiName);

  } else {

    const instanceResult: IEthereumContractInstanceDbModel | null = await _retrieveSmartContractInstance(address);

    if (!instanceResult) {

      await registerAbi(alias, abi);
      await registerInstance(alias, address, alias);

    } else {

      LOG.error(`Smart contract ${alias} cannot be registered due to a conflict`);
      throw ethereumSmartContractConflictResponse;

    }

  }

}

export const registerAbi = async (name: string, abi: any[]): Promise<void> => {

  await _updateAbiVersion(name);

  const insertAbi: InsertOneWriteOpResult = await db.insertSmartContractAbi({
    abi,
    name,
  });

  if (insertAbi.result.ok) {

    LOG.info(`Smart contract abi registered as ${name}`);

  }

};

export const registerInstance = async (alias: string, address: string, abiName: string): Promise<void> => {

  const instanceResult: IEthereumContractInstanceDbModel | null = await _retrieveSmartContractInstance(address);

  if (!instanceResult) {

    let insertInstance: InsertOneWriteOpResult | null = null;
    const abi: IEthereumContractAbiDbModel | null = await db.getAbiByName(abiName);

    if (abi) {

      await _updateSmartContractVersion(alias);

      insertInstance = await db.insertSmartContract({
        abiName,
        address,
        alias,
      });

    } else {

      LOG.error(`Smart contract instance ${alias} cannot be registered, (abiName not found)`);
      throw ethereumSmartContractAbiNameNotFoundResponse;

    }

    if (insertInstance && insertInstance.result.ok) {

      LOG.info(`Smart contract instance registered as ${alias}`);

    }

  } else {

    LOG.error(`Smart contract instance ${alias} cannot be registered due to a conflict`);
    throw ethereumSmartContractConflictResponse;

  }

};

// tslint:disable-next-line:variable-name
export const _retrieveSmartContractInstance = async (address: string): Promise<IEthereumContractInstanceDbModel | null> => {

  let instanceResult: IEthereumContractInstanceDbModel | null;

  try {

    instanceResult = await db.getSmartContractByAddress(address);

  } catch (e) {

    LOG.error(`Smart contract ${address} cannot be registered: ${e}`);
    throw ethereumSmartContractInternalServerErrorResponse;

  }

  return instanceResult;

};

// tslint:disable-next-line:variable-name
export const _updateSmartContractVersion = async (alias: string): Promise<WriteOpResult | void> => {

  const aliasResult: IEthereumContractDbModel | null = await db.getSmartContractByAlias(alias);

  if (aliasResult) {

    const numVersions: number = await db.getCountVersionsByAlias(alias);
    const newAlias: string = `${alias}@${numVersions + 1}`;

    await db.updateSmartContractAlias(alias, newAlias);

  }
};

// tslint:disable-next-line:variable-name
export const _updateAbiVersion = async (name: string): Promise<WriteOpResult | void> => {

  const aliasResult: IEthereumContractAbiDbModel | null = await db.getAbiByName(name);

  if (aliasResult) {

    const numVersionsAbi: number = await db.getCountVersionsAbiByName(name);
    const newName: string = `${name}@${numVersionsAbi + 1}`;

    await db.updateSmartContractAbiName(name, newName);
    await db.updateAbiAlias(name, newName);

  }
};
