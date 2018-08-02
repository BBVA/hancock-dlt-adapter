import * as db from '../../../db/ethereum';
import { hancockDbError } from '../../../models/error';
import {
  IEthereumContractAbiDbModel,
  IEthereumContractDbModel,
  IEthereumSmartContractInvokeModel,
} from '../../../models/ethereum';
import { IEthereumTokenMetadataResponse } from '../../../models/ethereum/token';
import { error } from '../../../utils/error';
import logger from '../../../utils/logger';
import { hancockContractNotFoundError } from '../models/error';
import { adaptContractInvoke } from '../smartContract/common';
import { hancockContractAbiError, hancockContractInvokeError } from '../smartContract/models/error';
import { getAdaptRequestModel } from './common';
import { hancockContractTokenMetadataError } from './models/error';

export const getTokenMetadata = async (address: string): Promise<any> => {

  logger.info(`Token Metadata`);
  let abi: IEthereumContractAbiDbModel | null;
  let promiseValues;

  try {

    abi = await db.getAbiByName('erc20');

  } catch (err) {

    throw error(hancockContractAbiError, err);

  }

  if (abi) {

    try {

      const invokeModelName: IEthereumSmartContractInvokeModel = getAdaptRequestModel(abi.abi, 'call', 'name', [], address);
      const name = adaptContractInvoke(invokeModelName);

      const invokeModelSymbol: IEthereumSmartContractInvokeModel = getAdaptRequestModel(abi.abi, 'call', 'symbol', [], address);
      const symbol = adaptContractInvoke(invokeModelSymbol);

      const invokeModelDecimals: IEthereumSmartContractInvokeModel = getAdaptRequestModel(abi.abi, 'call', 'decimals', [], address);
      const decimals = adaptContractInvoke(invokeModelDecimals);

      const invokeModelTotalSupply: IEthereumSmartContractInvokeModel = getAdaptRequestModel(abi.abi, 'call', 'totalSupply', [], address);
      const totalSupply = adaptContractInvoke(invokeModelTotalSupply);

      promiseValues = await Promise.all([name, symbol, decimals, totalSupply]);

    } catch (err) {

      throw error(hancockContractInvokeError, err);

    }

    const object = {
      decimals: promiseValues[2],
      name: promiseValues[0],
      symbol: promiseValues[1],
      totalSupply: promiseValues[3],
    };

    return object;

  } else {

    throw error(hancockContractNotFoundError);

  }

};

export const getTokenMetadataByQuery = async (addressOrAlias: string): Promise<IEthereumTokenMetadataResponse> => {

  logger.info(`Token Metadata By Query`);
  let abi: IEthereumContractDbModel | null;

  try {

    abi = await db.getSmartContractByAddressOrAlias(addressOrAlias);

  } catch (err) {

    throw error(hancockDbError, err);

  }

  if (abi) {

    try {

      return await getTokenMetadata(abi.address);

    } catch (err) {

      throw error(hancockContractTokenMetadataError, err);

    }

  } else {

    throw error(hancockContractNotFoundError);

  }

};
