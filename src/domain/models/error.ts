import { HancockError } from '../../models/error';

export const hancockProtocolDecodeError = new HancockError('50024', 500, 'Protocol - Decode Error');
export const hancockProtocolEncodeError = new HancockError('50025', 500, 'Protocol - Encode Error');
