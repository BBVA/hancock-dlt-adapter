import * as db from '../../../db/ethereum';
import {
  ethereumSmartContractInternalServerErrorResponse,
  IEthereumContractDbModel,
} from '../../../models/ethereum/smartContract';
import { retrieveContractAbiByAddressOrAlias } from '../smartContract/common';

export async function find(): Promise<IEthereumContractDbModel[]> {

  try {

    const contractDbModel: IEthereumContractDbModel[] = await db.getAllSmartContracts();
    LOG.info(`Listing all resources`);
    return contractDbModel;

  } catch (e) {

    LOG.error(`Error retrieving smart contract: ${e}`);
    throw ethereumSmartContractInternalServerErrorResponse;

  }
}

export async function findOne(addressOrAlias: string): Promise<IEthereumContractDbModel> {

  try {

    const contractDbModel: IEthereumContractDbModel = await retrieveContractAbiByAddressOrAlias(addressOrAlias);
    LOG.info('One contract found', contractDbModel);
    return contractDbModel;

  } catch (e) {

    LOG.error(`Error retrieving smart contract: ${e}`);
    throw e;

  }
}
