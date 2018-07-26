import * as db from '../../../db/ethereum';
import { ethereumSmartContractNotFoundResponse,
  IEthereumContractAbiDbModel,
  IEthereumContractDbModel,
  IEthereumSmartContractInvokeModel,
} from '../../../models/ethereum';
import { IEthereumTokenMetadataResponse } from '../../../models/ethereum/token';
import * as logger from '../../../utils/logger';
import { adaptContractInvoke } from '../smartContract/common';
import { getAdaptRequestModel } from './common';

const LOG = logger.getLogger();

export const getTokenMetadata = async (address: string): Promise<any> => {

  LOG.info(`Token Metadata`);

  try {

    const abi: IEthereumContractAbiDbModel | null = await db.getAbiByName('erc20');

    if (abi) {

      const invokeModelName: IEthereumSmartContractInvokeModel = getAdaptRequestModel(abi.abi, 'call', 'name', [], address);
      const name = adaptContractInvoke(invokeModelName);

      const invokeModelSymbol: IEthereumSmartContractInvokeModel = getAdaptRequestModel(abi.abi, 'call', 'symbol', [], address);
      const symbol = adaptContractInvoke(invokeModelSymbol);

      const invokeModelDecimals: IEthereumSmartContractInvokeModel = getAdaptRequestModel(abi.abi, 'call', 'decimals', [], address);
      const decimals = adaptContractInvoke(invokeModelDecimals);

      const invokeModelTotalSupply: IEthereumSmartContractInvokeModel = getAdaptRequestModel(abi.abi, 'call', 'totalSupply', [], address);
      const totalSupply = adaptContractInvoke(invokeModelTotalSupply);

      const promiseValues = await Promise.all([name, symbol, decimals, totalSupply]);

      const object = {
        decimals: promiseValues[2],
        name: promiseValues[0],
        symbol: promiseValues[1],
        totalSupply: promiseValues[3],
      };

      return object;

    } else {

      LOG.info('Contract not found');
      throw ethereumSmartContractNotFoundResponse;

    }

  } catch (e) {

    LOG.error(e);
    throw e;

  }
};

export const getTokenMetadataByQuery = async (addressOrAlias: string): Promise<IEthereumTokenMetadataResponse> => {

  LOG.info(`Token Metadata By Query`);

  try {

    const abi: IEthereumContractDbModel | null = await db.getSmartContractByAddressOrAlias(addressOrAlias);

    if (abi) {

      return await getTokenMetadata(abi.address);

    } else {

      LOG.info('Contract not found');
      throw ethereumSmartContractNotFoundResponse;

    }

  } catch (e) {

    LOG.error(e);
    throw e;

  }
};
