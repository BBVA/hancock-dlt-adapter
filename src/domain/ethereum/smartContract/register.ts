import { InsertOneWriteOpResult, WriteOpResult } from 'mongodb';
import * as db from '../../../db/ethereum';
import { hancockDbError } from '../../../models/error';
import {
  IEthereumContractAbiDbModel,
  IEthereumContractDbModel,
  IEthereumContractInstanceDbModel,
} from '../../../models/ethereum/smartContract';
import { error } from '../../../utils/error';
import logger from '../../../utils/logger';
import { hancockContractNotFoundError } from '../models/error';
import {
  hancockContractAbiError,
  hancockContractConflictError,
  hancockContractRegisterError,
} from './models/error';

export async function register(alias: string, address: string, abi: any[], abiName?: string): Promise<void> {

  try {

    if (abiName) {

      await registerInstance(alias, address, abiName);

    } else {

      const instanceResult: IEthereumContractInstanceDbModel | null = await _retrieveSmartContractInstance(address);

      if (!instanceResult) {

        await registerAbi(alias, abi);
        await registerInstance(alias, address, alias);

      } else {

        logger.error(`Smart contract ${alias} cannot be registered due to a conflict`);
        throw error(hancockContractConflictError);

      }

    }

  } catch (err) {

    logger.error(err);
    throw error(hancockContractRegisterError, err);

  }

}

export const registerAbi = async (name: string, abi: any[]): Promise<void> => {

  try {

    await _updateAbiVersion(name);

  } catch (err) {

    logger.error(err);
    throw error(hancockContractRegisterError, err);

  }

  try {

    const insertAbi: InsertOneWriteOpResult = await db.insertSmartContractAbi({
      abi,
      name,
    });

    if (insertAbi.result.ok) {

      logger.info(`Smart contract abi registered as ${name}`);

    } else {

      logger.error(`Smart contract ${name} abi cannot be registered`);
      throw error(hancockContractRegisterError);

    }

  } catch (err) {

    logger.error(err);
    throw error(hancockDbError);

  }

};

export const registerInstance = async (alias: string, address: string, abiName: string): Promise<void> => {

  let instanceResult: IEthereumContractInstanceDbModel | null;

  try {

    instanceResult = await _retrieveSmartContractInstance(address);

  } catch (err) {

    logger.error(err);
    throw error(hancockContractRegisterError, err);

  }

  if (!instanceResult) {

    let insertInstance: InsertOneWriteOpResult | null = null;
    let abi: IEthereumContractAbiDbModel | null;

    try {

      abi = await db.getAbiByName(abiName);

    } catch (err) {

      logger.error(err);
      throw error(hancockDbError);

    }

    if (abi) {

      try {

        await _updateSmartContractVersion(alias);

      } catch (err) {

        throw error(hancockContractRegisterError, err);

      }

      try {

        insertInstance = await db.insertSmartContract({
          abiName,
          address,
          alias,
        });

      } catch (err) {

        logger.error(err);
        throw error(hancockDbError);

      }

    } else {

      logger.error(`Smart contract instance ${alias} cannot be registered, (abiName not found)`);
      throw error(hancockContractAbiError);

    }

    if (insertInstance && insertInstance.result.ok) {

      logger.info(`Smart contract instance registered as ${alias}`);

    } else {

      logger.error(`Smart contract ${alias} instance cannot be registered`);
      throw error(hancockContractRegisterError);

    }

  } else {

    logger.error(`Smart contract instance ${alias} cannot be registered due to a conflict`);
    throw error(hancockContractConflictError);

  }

};

// tslint:disable-next-line:variable-name
export const _retrieveSmartContractInstance = async (address: string): Promise<IEthereumContractInstanceDbModel | null> => {

  let instanceResult: IEthereumContractInstanceDbModel | null;

  try {

    instanceResult = await db.getSmartContractByAddress(address);

    if (!instanceResult) {

      logger.error(`Smart contract ${address} cannot be found`);
      throw error(hancockContractNotFoundError);

    }

  } catch (err) {

    logger.error(`Smart contract ${address} cannot be found`);
    throw error(hancockDbError, err);

  }

  return instanceResult;

};

// tslint:disable-next-line:variable-name
export const _updateSmartContractVersion = async (alias: string): Promise<WriteOpResult | void> => {

  let aliasResult: IEthereumContractDbModel | null;

  try {

    aliasResult = await db.getSmartContractByAlias(alias);

  } catch (err) {

    logger.error(err);
    throw error(hancockDbError, err);

  }

  if (aliasResult) {

    try {

      const numVersions: number = await db.getCountVersionsByAlias(alias);
      const newAlias: string = `${alias}@${numVersions + 1}`;

      await db.updateSmartContractAlias(alias, newAlias);

    } catch (err) {

      logger.error(err);
      throw error(hancockDbError, err);

    }

  } else {

    logger.error(`Smart contract ${alias} cannot be found`);
    throw error(hancockContractNotFoundError);

  }

};

// tslint:disable-next-line:variable-name
export const _updateAbiVersion = async (name: string): Promise<WriteOpResult | void> => {

  let aliasResult: IEthereumContractAbiDbModel | null;

  try {

    aliasResult = await db.getAbiByName(name);

  } catch (err) {

    logger.error(err);
    throw error(hancockDbError, err);

  }

  if (aliasResult) {

    try {

      const numVersionsAbi: number = await db.getCountVersionsAbiByName(name);
      const newName: string = `${name}@${numVersionsAbi + 1}`;

      await db.updateSmartContractAbiName(name, newName);
      await db.updateAbiAlias(name, newName);

    } catch (err) {

      logger.error(err);
      throw error(hancockDbError, err);

    }

  } else {

    logger.error(`Smart contract ${name} abi cannot be found`);
    throw error(hancockContractAbiError);

  }
};
