import { HancockError } from '../../../models/error';

export const hancockContractNotFoundError = new HancockError('40401', 404, 'Smart Contract - Not Found');
export const hancockEthereumBalanceError = new HancockError('50023', 500, 'Ethereum - Balance Error');
export const hancockEthereumTrasnferError = new HancockError('50024', 500, 'Ethereum - Trasnfer Error');
