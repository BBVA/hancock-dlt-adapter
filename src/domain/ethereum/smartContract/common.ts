import * as request from 'request-promise-native';
import * as db from '../../../db/ethereum';
import { ContractAbi, IEthereumSmartContractInvokeModel, SC_DEFAULT_ACTION } from '../../../models/ethereum';
import { EthereumSmartContractNotFoundResponse } from '../../../models/ethereum/smartContract';
import {
  EthereumSmartContractInternalServerErrorResponse,
  EthereumSmartContractSourcecodeNotFoundErrorResponse,
  IEthereumContractDbModel,
  IEthereumSmartContractRawTxResponse,
  IEthereumSmartContractRequestAction,
  SC_REQUEST_ACTIONS,
} from '../../../models/ethereum/smartContract';

export async function retrieveContractAbiByAddressOrAlias(addressOrAlias: string): Promise<IEthereumContractDbModel> {

  LOG.info(`Find contract by query: ${addressOrAlias}`);

  let contractDbModel: IEthereumContractDbModel | null;

  try {

    contractDbModel = await db.getSmartContractByAddressOrAlias(addressOrAlias);

  } catch (e) {

    LOG.error(`Error retrieving contract from ddbb: ${e}`);
    throw EthereumSmartContractInternalServerErrorResponse;

  }

  if (!contractDbModel) {

    LOG.info('Contract not found');
    throw EthereumSmartContractNotFoundResponse;

  } else {

    return contractDbModel;

  }

}

export async function retrieveContractAbi(urlBase: string): Promise<ContractAbi> {

  LOG.info('Retrieving contract ABI');

  try {

    const data: string = await request(`${urlBase}.abi`);
    return JSON.parse(data) as ContractAbi;

  } catch (e) {

    throw EthereumSmartContractSourcecodeNotFoundErrorResponse;

  }

}

export async function retrieveContractBinary(urlBase: string): Promise<string> {

  LOG.info('Retrieving contract binary');

  try {

    return await request(`${urlBase}.bin`);

  } catch (e) {

    throw EthereumSmartContractSourcecodeNotFoundErrorResponse;

  }

}

export async function adaptContractInvoke(contractInvokeReq: IEthereumSmartContractInvokeModel): Promise<IEthereumSmartContractRawTxResponse> {

  LOG.info('Adapting contract invoke');

  const contract: any = new ETH.web3.eth.Contract(contractInvokeReq.abi, contractInvokeReq.to);
  const action: IEthereumSmartContractRequestAction = contractInvokeReq.action || SC_DEFAULT_ACTION;

  return new Promise<IEthereumSmartContractRawTxResponse>((resolve, reject) => {

    LOG.info('Invoking contract');

    const contractMethod: any = contract
      .methods[contractInvokeReq.method]
      .apply(null, contractInvokeReq.params);

    switch (action) {
      case SC_REQUEST_ACTIONS.SEND:

        contractMethod[action].call(null, { from: contractInvokeReq.from }, (error: Error, result: IEthereumSmartContractRawTxResponse) => {

          LOG.info(`Adapt invoke (${action}) callback`);

          if (error) {

            LOG.error(`Error sending contract (${action}) invocation`);
            reject(error);

          } else {

            LOG.info(`Contract (${action}) invocation successfully adapted`);
            resolve(result);

          }

        });

        break;

      case SC_REQUEST_ACTIONS.CALL:
      default:

        contractMethod[action].call(null, { from: contractInvokeReq.from }, (error: Error, result: any) => {

          LOG.info(`Adapt invoke (${action}) callback`);

          if (error) {

            LOG.error(`Error contract (${action}) invocation`);
            reject(error);

          } else {

            LOG.info(`Contract (${action}) invocation success`);
            resolve(result);

          }

        });

        break;
    }
  });
}
