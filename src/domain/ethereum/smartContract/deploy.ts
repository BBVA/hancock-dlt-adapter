import { IEthereumSmartContractDeployModel } from '../../../models/ethereum';
import { IEthereumSmartContractDeployRequest } from '../../../models/ethereum/smartContract';
import { retrieveContractAbi, retrieveContractBinary } from '../common';
import { ContractAbi, ContractBin } from './../../../models/ethereum/common';

export async function deploy(deployRequest: IEthereumSmartContractDeployRequest): Promise<any> {

  LOG.debug('contract deploy');

  try {

    const abi: ContractAbi = await retrieveContractAbi(deployRequest.urlBase);
    const bin: ContractBin = await retrieveContractBinary(deployRequest.urlBase);

    const deployModel: IEthereumSmartContractDeployModel = {
      ...deployRequest,
      abi,
      bin,
    } as IEthereumSmartContractDeployModel;

    return await adaptContractDeploy(deployModel);

  } catch (e) {

    LOG.debug(e);
    throw e;

  }
}

async function adaptContractDeploy(contractDeployModel: IEthereumSmartContractDeployModel): Promise<any> {

  LOG.debug('Adapting contract deploy');

  const contract: any = new ETH.web3.eth.Contract(contractDeployModel.abi);

  return new Promise((resolve, reject) => {

    LOG.debug('Deploying contract');

    contract
      .deploy({ data: '0x' + contractDeployModel.bin, arguments: contractDeployModel.params })
      .send({ from: contractDeployModel.from }, (error: Error, result: any) => {

        LOG.debug('Adapt deploy callback');

        if (error) {

          LOG.debug('Error sending contract deployment');
          reject(error);

        } else {

          LOG.debug('Contract deployment successfully adapted');
          resolve(result);

        }
      })
      .on('error', console.error);

  });
}
