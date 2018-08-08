import * as db from '../../../db/ethereum';
import { hancockDbError } from '../../../models/error';
import { IEthereumContractAbiDbModel, IEthereumContractDbModel, IEthereumSmartContractInvokeModel } from '../../../models/ethereum';
import { IEthereumTokenBalanceResponse, TokenNames } from '../../../models/ethereum/token';
import { error } from '../../../utils/error';
import logger from '../../../utils/logger';
import { hancockContractNotFoundError } from '../models/error';
import { adaptContractInvoke } from '../smartContract/common';
import { hancockContractAbiError, hancockContractInvokeError } from '../smartContract/models/error';

export async function tokenBalanceOf(contractAddress: string, address: string): Promise<IEthereumTokenBalanceResponse> {

  logger.info(`Token balanceOf call`);

  let abi: IEthereumContractAbiDbModel | null;
  let promiseValues: string[];

  try {

    abi = await db.getAbiByName(TokenNames.ERC20);

  } catch (err) {

    throw error(hancockDbError, err);

  }

  if (abi) {

    const invokeModelBalance: IEthereumSmartContractInvokeModel = {
      abi: abi.abi,
      action: 'call',
      from: address,
      method: 'balanceOf',
      params: [address],
      to: contractAddress,
    };

    const invokeModelDecimals: IEthereumSmartContractInvokeModel = {
      abi: abi.abi,
      action: 'call',
      from: address,
      method: 'decimals',
      params: [],
      to: contractAddress,
    };

    try {

      const balance: Promise<string> = adaptContractInvoke<string>(invokeModelBalance);
      const decimals: Promise<string> = adaptContractInvoke<string>(invokeModelDecimals);

      promiseValues = await Promise.all([balance, decimals]);

    } catch (err) {

      throw error(hancockContractInvokeError, err);

    }

    return {
      balance: promiseValues[0],
      accuracy: promiseValues[1],
    };

  } else {

    throw error(hancockContractAbiError);

  }
}

export async function tokenBalanceOfByQuery(addressOrAlias: string, address: string): Promise<any> {

  logger.info(`Token balanceOf call by query`);
  let contractDbModel: IEthereumContractDbModel | null;

  try {

    contractDbModel = await db.getSmartContractByAddressOrAlias(addressOrAlias);

  } catch (err) {

    throw error(hancockDbError, err);

  }

  if (contractDbModel) {

    try {

      return await tokenBalanceOf(contractDbModel.address, address);

    } catch (err) {

      throw error(hancockContractInvokeError, err);

    }

  } else {

    throw error(hancockContractNotFoundError);

  }
}
