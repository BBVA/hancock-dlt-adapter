import { HancockError } from '../../models/error';

export const hancockProtocolDecodeError = new HancockError('50026', 500, 'Protocol - Decode Error');
export const hancockProtocolEncodeError = new HancockError('50027', 500, 'Protocol - Encode Error');
