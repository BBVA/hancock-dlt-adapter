import { HancockError } from '../../../models/error';

export const hancockContractNotFoundError = new HancockError('50005', 500, 'Smart Contract - Not Found Error');
export const hancockEthereumBalanceError = new HancockError('50023', 500, 'Ethereum - Balance Error');
export const hancockEthereumTrasnferError = new HancockError('50024', 500, 'Ethereum - Trasnfer Error');
