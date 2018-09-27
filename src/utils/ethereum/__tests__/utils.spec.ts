import 'jest';
import * as ethereumUtils from '../utils';

describe('ethereumUtils', () => {

  describe('::getScQueryByAddressOrAlias', () => {

    it('should return the mongo query to find contracModels by alias', () => {

      const alias: string = 'mockedAddressOrAlias';
      const result: {} = ethereumUtils.getScQueryByAddressOrAlias(alias);

      expect(result).toEqual({ alias });

    });

    it('should return the mongo query to find contracModels by address', () => {

      const fortyHexChars: string = Array.from({ length: 40 }, (i) => Math.floor(Math.random() * 10)).join('');
      const address: string = `0x${fortyHexChars}`;

      const result: {} = ethereumUtils.getScQueryByAddressOrAlias(address);

      expect(result).toEqual({ address });

    });

  });

});
