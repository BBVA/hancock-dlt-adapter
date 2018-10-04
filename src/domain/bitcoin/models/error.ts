import { HancockError } from '../../../models/error';

export const hancockContractNotFoundError = new HancockError('40401', 404, 'Smart Contract - Not Found');
export const hancockBitcoinBalanceError = new HancockError('50023', 500, 'Bitcoin - Balance Error');
export const hancockBitcoinTransferError = new HancockError('50024', 500, 'Bitcoin - Transfer Error');
