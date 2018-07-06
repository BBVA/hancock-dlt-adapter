// Important: Test this... wrong official typings
// import Web3 from 'web3';
import * as ProviderEngine from 'web3-provider-engine';
import * as RpcSubprovider from 'web3-provider-engine/subproviders/rpc';
import config from '../config';
import { TxAdapter } from './txAdapter';

// Important: Test this... wrong official typings
// tslint:disable-next-line:no-var-requires
const Web3 = require('web3');

export class Ethereum {

  public engine: any;
  public web3: any;

  constructor() {

    this.engine = new ProviderEngine();
    this.web3 = new Web3(this.engine);

    this.engine.addProvider(new TxAdapter());

    // data source
    this.engine.addProvider(new RpcSubprovider({
      rpcUrl: `${config.blockchain.ethereum.protocol}://${config.blockchain.ethereum.host}:${config.blockchain.ethereum.port}`,
    }));

    // network connectivity error
    this.engine.on('error', (err: Error) => {
      // report connectivity errors
      console.error(err.stack);
    });

    // start polling for blocks
    this.engine.start();

  }
}
