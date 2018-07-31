
import 'jest';
import { hancockProtocolDecodeError, hancockProtocolEncodeError } from '../models/error';
import * as protocolDomain from '../protocol';

jest.mock('../../utils/config');
jest.mock('../../utils/logger');
jest.mock('../../utils/error');

describe('protocolDomain', () => {

  const decodedPayload: any = {
    whatever: 'whatever',
  };

  const encodedPayload: string = 'http://mockEncode?c=%7B%22whatever%22%3A%22whatever%22%7D';

  it('should encode the given payload', () => {

    const result: string = protocolDomain.encode(decodedPayload);

    expect(result).toBe(encodedPayload);

  });

  it('should decode the given payload', () => {

    const result: any = protocolDomain.decode(encodedPayload);

    expect(result).toEqual(decodedPayload);

  });

  it('should throw an exception in decode with undefined as parameter', () => {

    try {

      protocolDomain.decode(null);

    } catch (err) {

      expect(err).toBe(hancockProtocolDecodeError);

    }

  });

});
