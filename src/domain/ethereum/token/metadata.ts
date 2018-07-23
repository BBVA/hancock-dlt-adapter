import * as db from '../../../db/ethereum';
import { EthereumSmartContractNotFoundResponse,
  IEthereumContractAbiDbModel,
  IEthereumContractDbModel,
  IEthereumSmartContractInvokeByQueryRequest,
  IEthereumSmartContractInvokeModel,
  IEthereumSmartContractRequestAction,
} from '../../../models/ethereum';
import { IEthereumTokenMetadataResponse } from '../../../models/ethereum/token';
import { adaptContractInvoke } from '../smartContract/common';
import { invokeByQuery } from '../smartContract/invoke';
import { getAdaptRequestModel, getRequestModel } from './common';

export const getTokenMetadata = async (address: string): Promise<any> => {

  LOG.info(`Token Metadata`);

  try {

    const abi: IEthereumContractAbiDbModel | null = await db.getAbiByName('erc20');

    if (abi) {

      const invokeModelName: IEthereumSmartContractInvokeModel = getAdaptRequestModel(abi.abi, 'send', 'name', [], address);
      const name = await adaptContractInvoke(invokeModelName);

      const invokeModelSymbol: IEthereumSmartContractInvokeModel = getAdaptRequestModel(abi.abi, 'send', 'symbol', [], address);
      const symbol = await adaptContractInvoke(invokeModelSymbol);

      const invokeModelDecimals: IEthereumSmartContractInvokeModel = getAdaptRequestModel(abi.abi, 'send', 'decimals', [], address);
      const decimals = await adaptContractInvoke(invokeModelDecimals);

      const invokeModelTotalSupply: IEthereumSmartContractInvokeModel = getAdaptRequestModel(abi.abi, 'send', 'totalSupply', [], address);
      const totalSupply = await adaptContractInvoke(invokeModelTotalSupply);

      const object = {
        decimals,
        name,
        symbol,
        totalSupply,
      };

      return object;

    } else {

      LOG.info('Contract not found');
      throw EthereumSmartContractNotFoundResponse;

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
      throw EthereumSmartContractNotFoundResponse;

    }

  } catch (e) {

    LOG.error(e);
    throw e;

  }
};
