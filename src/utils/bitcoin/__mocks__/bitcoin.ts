
// tslint:disable-next-line:variable-name
export const __transaction_instance__ = {
  from: jest.fn().mockReturnThis(),
  to: jest.fn().mockReturnThis(),
  change: jest.fn().mockReturnThis(),
  addData: jest.fn().mockReturnThis(),
  serialize: jest.fn(),
};

// tslint:disable-next-line:variable-name
export const __client__ = {
  api: {
    getBalance: jest.fn(),
    getUtxo: jest.fn(),
  },
  lib: {
    Transaction: jest.fn().mockImplementation(() => __transaction_instance__),
  },
};

export const getBitcoinClient = jest.fn().mockResolvedValue(__client__);
