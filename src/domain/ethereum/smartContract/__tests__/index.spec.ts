import 'jest';
import * as index from '../index';

jest.mock('../delete');
jest.mock('../deploy');
jest.mock('../invoke');
jest.mock('../register');
jest.mock('../retrieve');

describe('ethereumScIndex', () => {

  it('should export all the ethereumScPackages', () => {

    expect(index.deleteByQuery).toBeDefined();
    expect(index.deploy).toBeDefined();
    expect(index.invokeByQuery).toBeDefined();
    expect(index.register).toBeDefined();
    expect(index.find).toBeDefined();

  });

});
