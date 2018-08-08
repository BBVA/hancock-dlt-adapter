import * as request from 'request-promise-native';
import * as db from '../../../db/ethereum';
import { hancockDbError } from '../../../models/error';
import { ContractAbi, IEthereumSmartContractInvokeModel, SC_DEFAULT_ACTION } from '../../../models/ethereum';
import {
  IEthereumContractDbModel,
  IEthereumSmartContractRawTxResponse,
  IEthereumSmartContractRequestAction,
  SC_REQUEST_ACTIONS,
} from '../../../models/ethereum/smartContract';
import { error } from '../../../utils/error';
import logger from '../../../utils/logger';
import { hancockContractNotFoundError } from '../models/error';
import {
  hancockContractAbiError,
  hancockContractBinaryError,
  hancockContractCallError,
  hancockContractMethodNotFoundError,
  hancockContractSendError,
} from './models/error';

export async function retrieveContractAbiByAddressOrAlias(addressOrAlias: string): Promise<IEthereumContractDbModel> {

  logger.info(`Find contract by query: ${addressOrAlias}`);

  let contractDbModel: IEthereumContractDbModel | null;

  try {

    contractDbModel = await db.getSmartContractByAddressOrAlias(addressOrAlias);

  } catch (e) {

    throw error(hancockDbError, e);

  }

  if (!contractDbModel) {

    logger.info('Contract not found');
    throw error(hancockContractNotFoundError);

  } else {

    return contractDbModel;

  }

}

export async function retrieveContractAbi(urlBase: string): Promise<ContractAbi> {

  logger.info('Retrieving contract ABI');

  try {

    const data: string = await request(`${urlBase}.abi`);
    return JSON.parse(data) as ContractAbi;

  } catch (e) {

    throw error(hancockContractAbiError, e);

  }

}

export async function retrieveContractBinary(urlBase: string): Promise<string> {

  logger.info('Retrieving contract binary');

  try {

    return await request(`${urlBase}.bin`);

  } catch (e) {

    throw error(hancockContractBinaryError, e);

  }

}

export async function adaptContractInvoke<T = IEthereumSmartContractRawTxResponse>(contractInvokeReq: IEthereumSmartContractInvokeModel): Promise<T> {

  logger.info('Adapting contract invoke');

  const contract: any = new ETH.web3.eth.Contract(contractInvokeReq.abi, contractInvokeReq.to);
  const action: IEthereumSmartContractRequestAction = contractInvokeReq.action || SC_DEFAULT_ACTION;

  return new Promise<T>((resolve, reject) => {

    logger.info('Invoking contract');

    let contractMethod: any;

    try {

      contractMethod = contract
        .methods[contractInvokeReq.method]
        .apply(null, contractInvokeReq.params);

    } catch (err) {

      throw error(hancockContractMethodNotFoundError);

    }

    switch (action) {
      case SC_REQUEST_ACTIONS.SEND:

        contractMethod[action].call(null, { from: contractInvokeReq.from }, (err: Error, result: T) => {

          logger.info(`Adapt invoke (${action}) callback`);

          if (err) {

            throw error(hancockContractSendError, err);

          } else {

            logger.info(`Contract (${action}) invocation successfully adapted`);
            resolve(result);

          }

        });

        break;

      case SC_REQUEST_ACTIONS.CALL:
      default:

        contractMethod[action].call(null, { from: contractInvokeReq.from }, (err: Error, result: T) => {

          logger.info(`Adapt invoke (${action}) callback`);

          if (err) {

            throw error(hancockContractCallError, err);

          } else {

            logger.info(`Contract (${action}) invocation success`);
            resolve(result);

          }

        });

        break;
    }
  });
}
