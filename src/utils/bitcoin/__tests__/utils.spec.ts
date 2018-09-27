import 'jest';
import * as bitcoinUtils from '../utils';

describe('bitcoinUtils', () => {

  describe('::getScQueryByAddressOrAlias', () => {

    it('should return the mongo query to find contracModels by alias', () => {

      const alias: string = 'mockedAddressOrAlias';
      const result: {} = bitcoinUtils.getScQueryByAddressOrAlias(alias);

      expect(result).toEqual({ alias });

    });

    it('should return the mongo query to find contracModels by address', () => {

      const thirtyAlphanumericChars: string = Array.from({ length: 40 }, (i) => Math.floor(Math.random() * 10)).join('');
      const address: string = `1${thirtyAlphanumericChars}`;

      const result: {} = bitcoinUtils.getScQueryByAddressOrAlias(address);

      expect(result).toEqual({ address });

    });

  });

});
