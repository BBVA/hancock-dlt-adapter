import * as db from '../../../db/ethereum';
import { EthereumSmartContractNotFoundResponse,
  IEthereumContractDbModel,
  IEthereumSmartContractInvokeByQueryRequest,
  IEthereumSmartContractRequestAction } from '../../../models/ethereum';
import { IEthereumTokenMetadataResponse } from '../../../models/ethereum/token';
import { invokeByQuery } from '../smartContract/invoke';
import { getRequestModel } from './common';

export async function getTokenMetadata(addressOrAlias: string): Promise<IEthereumTokenMetadataResponse> {

  LOG.info(`Token Metadata`);

  try {

    const abi: IEthereumContractDbModel | null = await db.getSmartContractByAddressOrAlias(addressOrAlias);

    if (abi) {

          const invokeModelName: IEthereumSmartContractInvokeByQueryRequest = getRequestModel('call', abi.address, 'name', []);
          const name = await invokeByQuery(addressOrAlias, invokeModelName);

          const invokeModelSymbol: IEthereumSmartContractInvokeByQueryRequest = getRequestModel('call', abi.address, 'symbol', []);
          const symbol = await invokeByQuery(addressOrAlias, invokeModelSymbol);

          const invokeModelDecimal: IEthereumSmartContractInvokeByQueryRequest = getRequestModel('call', abi.address, 'decimals', []);
          const decimals = await invokeByQuery(addressOrAlias, invokeModelDecimal);

          const invokeModelTotalSupply: IEthereumSmartContractInvokeByQueryRequest = getRequestModel('call', abi.address, 'totalSupply', []);
          const totalSupply = await invokeByQuery(addressOrAlias, invokeModelTotalSupply);

          const object: IEthereumTokenMetadataResponse = {
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
}
