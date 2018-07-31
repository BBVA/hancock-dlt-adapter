import { HancockError } from '../../../../models/error';

export const hancockContractTokenAllowanceError = new HancockError('50015', 500, 'Smart Contract Token - Allowance Error');
export const hancockContractTokenApproveError = new HancockError('50016', 500, 'Smart Contract Token - Approve Error');
export const hancockContractTokenMetadataError = new HancockError('50017', 500, 'Smart Contract Token - Fetching Metadata Error');
export const hancockContractTokenRegisterError = new HancockError('50018', 500, 'Smart Contract Token - Register Error');
export const hancockContractTokenTransferError = new HancockError('50019', 500, 'Smart Contract Token - Transfer Error');
export const hancockContractTokenTransferFromError = new HancockError('50020', 500, 'Smart Contract Token - TransferFrom Error');
export const hancockContractTokenBalanceError = new HancockError('50021', 500, 'Smart Contract Token - Balance Error');
