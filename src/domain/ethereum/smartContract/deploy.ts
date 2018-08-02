import { IEthereumSmartContractDeployModel } from '../../../models/ethereum';
import {
  IEthereumSmartContractDeployRequest,
} from '../../../models/ethereum/smartContract';
import { error } from '../../../utils/error';
import logger from '../../../utils/logger';
import { retrieveContractAbi, retrieveContractBinary } from '../smartContract/common';
import { ContractAbi, ContractBin } from './../../../models/ethereum/common';
import { hancockContractAbiError, hancockContractBinaryError, hancockContractDeployError } from './models/error';

export async function deploy(deployRequest: IEthereumSmartContractDeployRequest): Promise<any> {

  logger.debug('contract deploy');
  let abi: ContractAbi;
  let bin: ContractBin;

  try {

    abi = await retrieveContractAbi(deployRequest.urlBase);

  } catch (e) {

    throw error(hancockContractAbiError, e);

  }

  try {

    bin = await retrieveContractBinary(deployRequest.urlBase);

  } catch (e) {

    throw error(hancockContractBinaryError, e);

  }

  const deployModel: IEthereumSmartContractDeployModel = {
    ...deployRequest,
    abi,
    bin,
  } as IEthereumSmartContractDeployModel;

  try {

    return await _adaptContractDeploy(deployModel);

  } catch (err) {

    throw error(hancockContractDeployError, err);

  }

}

// tslint:disable-next-line:variable-name
export const _adaptContractDeploy = async (contractDeployModel: IEthereumSmartContractDeployModel): Promise<any> => {

  logger.debug('Adapting contract deploy');

  try {

    const contract: any = new ETH.web3.eth.Contract(contractDeployModel.abi);

    return new Promise((resolve, reject) => {

      logger.debug('Deploying contract');

      contract
        .deploy({ data: '0x' + contractDeployModel.bin, arguments: contractDeployModel.params })
        .send({ from: contractDeployModel.from }, (err: Error, result: any) => {

          logger.debug('Adapt deploy callback');

          if (err) {

            logger.debug('Error sending contract deployment');
            throw error(hancockContractDeployError, err);

          } else {

            logger.debug('Contract deployment successfully adapted');
            resolve(result);

          }
        })
        .on('error', (err: any) => {

          throw error(hancockContractDeployError, err);

        });
    });

  } catch (err) {

    throw error(hancockContractDeployError, err);

  }

};
