// tslint:disable-next-line:variable-name
const __logger__ = {
  debug: jest.fn(),
  error: jest.fn(),
  info: jest.fn(),
  log: jest.fn(),
};

export const getLogger = jest.fn().mockReturnValue(__logger__);
