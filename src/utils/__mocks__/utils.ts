export const createReply = jest.fn().mockImplementation((reply: any, result?: any, data?: any): any => {
  return true;
});

export const getScQueryByAddressOrAlias = jest.fn();

export const strToHex = jest.fn();
