export async function getBalance(address: string): Promise<number> {
  return new Promise<number>((resolve, reject) => {
    ETH.web3.eth.getBalance(address, (err: any, result: number) => err ? reject(err) : resolve(result));
  });
}

export * from './transfer';
export * from './smartContract';
