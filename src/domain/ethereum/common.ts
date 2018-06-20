import { Collection } from 'mongodb';
import * as request from 'request-promise-native';
import { ContractAbi, IEthereumSmartContractInvokeModel, SC_DEFAULT_ACTION } from '../../models/ethereum';
import { EthereumSmartContractNotFoundResponse } from '../../models/ethereum/smartContract';
import {
  EthereumSmartContractInternalServerErrorResponse,
  EthereumSmartContractSourcecodeNotFoundErrorResponse,
  IEthereumContractDbModel,
  IEthereumSmartContractRawTxResponse,
  IEthereumSmartContractRequestAction,
  SC_REQUEST_ACTIONS,
} from '../../models/ethereum/smartContract';

export async function retrieveContractAbiByAddressOrAlias(addressOrAlias: string): Promise<IEthereumContractDbModel> {

  const addressPattern: RegExp = new RegExp(/^0x[a-fA-F0-9]{40}$/i);
  const query: any = addressPattern.test(addressOrAlias)
    ? { address: addressOrAlias }
    : { alias: addressOrAlias };

  LOG.debug(`Find contract by query: ${JSON.stringify(query)}`);

  const db: any = DB.get();
  const collection: Collection = db.collection(CONF.db.ethereum.collections.smartContracts);

  let contractDbModel: IEthereumContractDbModel;
  try {

    contractDbModel = await collection.findOne(query);

  } catch (e) {

    LOG.error(`Error invoking contract: ${e}`);
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

  LOG.debug('Retrieving contract ABI');

  try {

    const data: string = await request(`${urlBase}.abi`);
    return JSON.parse(data) as ContractAbi;

  } catch (e) {

    throw EthereumSmartContractSourcecodeNotFoundErrorResponse;

  }

}

export async function retrieveContractBinary(urlBase: string): Promise<string> {

  LOG.debug('Retrieving contract binary');

  try {

    return await request(`${urlBase}.bin`);

  } catch (e) {

    throw EthereumSmartContractSourcecodeNotFoundErrorResponse;

  }

}

// tslint:disable-next-line:max-line-length
export async function adaptContractInvoke(contractInvokeReq: IEthereumSmartContractInvokeModel): Promise<IEthereumSmartContractRawTxResponse> {

  LOG.debug('Adapting contract invoke');

  const contract: any = new ETH.web3.eth.Contract(contractInvokeReq.abi, contractInvokeReq.to);
  const action: IEthereumSmartContractRequestAction = contractInvokeReq.action || SC_DEFAULT_ACTION;

  return new Promise<IEthereumSmartContractRawTxResponse>((resolve, reject) => {

    LOG.debug('Invoking contract');

    const contractMethod: any = contract
      .methods[contractInvokeReq.method]
      .apply(null, contractInvokeReq.params);

    switch (action) {
      case SC_REQUEST_ACTIONS.SEND:

        // tslint:disable-next-line:max-line-length
        contractMethod[action].call(null, { from: contractInvokeReq.from }, (error: Error, result: IEthereumSmartContractRawTxResponse) => {

          LOG.debug(`Adapt invoke (${action}) callback`);

          if (error) {

            LOG.debug(`Error sending contract (${action}) invocation`);
            reject(error);

          } else {

            LOG.debug(`Contract (${action}) invocation successfully adapted`);
            resolve(result);

          }

        })
          .on('error', console.error);

        break;

      case SC_REQUEST_ACTIONS.CALL:
      default:

        contractMethod[action].call(null, { from: contractInvokeReq.from }, (error: Error, result: any) => {

          LOG.debug(`Adapt invoke (${action}) callback`);

          if (error) {

            LOG.debug(`Error contract (${action}) invocation`);
            reject(error);

          } else {

            LOG.debug(`Contract (${action}) invocation success`);
            resolve(result);

          }

        })
          .on('error', console.error);

        break;
    }
  });
}
