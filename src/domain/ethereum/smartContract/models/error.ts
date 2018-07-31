import { HancockError } from '../../../../models/error';

export const hancockContractAbiError = new HancockError('50003', 500, 'Smart Contract - Error fetching Contract Abi');
export const hancockContractBinaryError = new HancockError('50004', 500, 'Smart Contract - Error fetching Contract Binary');
export const hancockContractMethodNotFoundError = new HancockError('50006', 500, 'Smart Contract - Method Not Found Error');
export const hancockContractSendError = new HancockError('50007', 500, 'Smart Contract - Send Error');
export const hancockContractCallError = new HancockError('50008', 500, 'Smart Contract - Call Error');
export const hancockContractDeleteError = new HancockError('50009', 500, 'Smart Contract - Delete Error');
export const hancockContractDeployError = new HancockError('50010', 500, 'Smart Contract - Deploy Error');
export const hancockContractInvokeError = new HancockError('50011', 500, 'Smart Contract - Invoke Error');
export const hancockContractRegisterError = new HancockError('50011', 500, 'Smart Contract - Register Error');
export const hancockContractUpdateVersionError = new HancockError('50012', 500, 'Smart Contract - Update Version Error');
export const hancockContractUpdateAbiVersionError = new HancockError('50013', 500, 'Smart Contract - Update Abi Version Error');
export const hancockContractRetrieveError = new HancockError('50014', 500, 'Smart Contract - Retrieve Error');
export const hancockContractConflictError = new HancockError('40900', 409, 'Smart Contract - Alias or address in use');
