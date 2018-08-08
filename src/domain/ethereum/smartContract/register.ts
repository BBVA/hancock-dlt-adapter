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
import {
  hancockContractAbiError,
  hancockContractConflictError,
  hancockContractRegisterError,
  hancockContractRetrieveError,
  hancockContractUpdateVersionError,
} from './models/error';

export async function register(alias: string, address: string, abi: any[], abiName?: string): Promise<void> {

  if (abiName) {

    try {

      await registerInstance(alias, address, abiName);

    } catch (err) {

      throw error(hancockContractRegisterError, err);

    }

  } else {

    let instanceResult: IEthereumContractInstanceDbModel | null;

    try {

      instanceResult = await _retrieveSmartContractInstance(address);

    } catch (err) {

      throw error(hancockContractRegisterError, err);

    }

    if (!instanceResult) {

      try {

        await registerAbi(alias, abi);
        await registerInstance(alias, address, alias);

      } catch (err) {

        throw error(hancockContractRegisterError, err);

      }

    } else {

      throw error(hancockContractConflictError);

    }

  }

}

export const registerAbi = async (name: string, abi: any[]): Promise<void> => {

  try {

    await _updateAbiVersion(name);

  } catch (err) {

    throw error(hancockContractRegisterError, err);

  }

  let insertAbi: InsertOneWriteOpResult;

  try {

    insertAbi = await db.insertSmartContractAbi({
      abi,
      name,
    });

  } catch (err) {

    throw error(hancockDbError, err);

  }

  if (insertAbi.result.ok) {

    logger.info(`Smart contract abi registered as ${name}`);

  } else {

    throw error(hancockContractRegisterError);

  }

};

export const registerInstance = async (alias: string, address: string, abiName: string): Promise<void> => {

  let instanceResult: IEthereumContractInstanceDbModel | null;

  try {

    instanceResult = await _retrieveSmartContractInstance(address);

  } catch (err) {

    throw error(hancockContractRetrieveError, err);

  }

  if (!instanceResult) {

    let insertInstance: InsertOneWriteOpResult | null = null;
    let abi: IEthereumContractAbiDbModel | null;

    try {

      abi = await db.getAbiByName(abiName);

    } catch (err) {

      throw error(hancockDbError, err);

    }

    if (abi) {

      try {

        await _updateSmartContractVersion(alias);

      } catch (err) {

        throw error(hancockContractUpdateVersionError, err);

      }

      try {

        insertInstance = await db.insertSmartContract({
          abiName,
          address,
          alias,
        });

      } catch (err) {

        throw error(hancockDbError, err);

      }

    } else {

      throw error(hancockContractAbiError);

    }

    if (insertInstance && insertInstance.result.ok) {

      logger.info(`Smart contract instance registered as ${alias}`);

    } else {

      throw error(hancockContractRegisterError);

    }

  } else {

    throw error(hancockContractConflictError);

  }

};

// tslint:disable-next-line:variable-name
export const _retrieveSmartContractInstance = async (address: string): Promise<IEthereumContractInstanceDbModel | null> => {

  let instanceResult: IEthereumContractInstanceDbModel | null;

  try {

    instanceResult = await db.getSmartContractByAddress(address);

  } catch (err) {

    throw error(hancockDbError, err);

  }

  return instanceResult;

};

// tslint:disable-next-line:variable-name
export const _updateSmartContractVersion = async (alias: string): Promise<WriteOpResult | void> => {

  let contract: IEthereumContractDbModel | null;

  try {

    contract = await db.getSmartContractByAlias(alias);

  } catch (err) {

    throw error(hancockDbError, err);

  }

  if (contract) {

    try {

      const numVersions: number = await db.getCountVersionsByAlias(alias);
      const newAlias: string = `${alias}@${numVersions + 1}`;

      await db.updateSmartContractAlias(alias, newAlias);

    } catch (err) {

      throw error(hancockDbError, err);

    }

  }

};

// tslint:disable-next-line:variable-name
export const _updateAbiVersion = async (name: string): Promise<WriteOpResult | void> => {

  let abi: IEthereumContractAbiDbModel | null;

  try {

    abi = await db.getAbiByName(name);

  } catch (err) {

    throw error(hancockDbError, err);

  }

  if (abi) {

    try {

      const numVersionsAbi: number = await db.getCountVersionsAbiByName(name);
      const newName: string = `${name}@${numVersionsAbi + 1}`;

      await db.updateSmartContractAbiName(name, newName);
      await db.updateAbiAlias(name, newName);

    } catch (err) {

      throw error(hancockDbError, err);

    }

  }

};
