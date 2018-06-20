import { Collection } from 'mongodb';
import {
  EthereumSmartContractInternalServerErrorResponse,
  IEthereumContractDbModel,
} from '../../../models/ethereum/smartContract';
import { retrieveContractAbiByAddressOrAlias } from '../common';

export async function find(): Promise<IEthereumContractDbModel[]> {

  const db: any = DB.get();
  const collection: Collection = db.collection(CONF.db.ethereum.collections.smartContracts);

  try {

    const contractDbModel: IEthereumContractDbModel[] = await collection.find().project({ _id: 0 }).toArray();
    LOG.info(`Listing all resources`);
    return contractDbModel;

  } catch (e) {

    LOG.error(`Error retrieving smart contract: ${e}`);
    throw EthereumSmartContractInternalServerErrorResponse;

  }
}

export async function findOne(addressOrAlias: string): Promise<IEthereumContractDbModel> {

  try {

    const contractDbModel: IEthereumContractDbModel = await retrieveContractAbiByAddressOrAlias(addressOrAlias);
    LOG.info('One contract found', contractDbModel);
    delete contractDbModel._id;
    return contractDbModel;

  } catch (e) {

    LOG.error(`Error retrieving smart contract: ${e}`);
    throw EthereumSmartContractInternalServerErrorResponse;

  }
}
