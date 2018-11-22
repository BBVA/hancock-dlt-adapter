// Important: Test this... wrong official typings
// import Web3 from 'web3';
import * as ProviderEngine from 'web3-provider-engine';
import * as RpcSubprovider from 'web3-provider-engine/subproviders/rpc';
import config from '../config';
import logger from '../logger';
import { TxAdapter } from './txAdapter';
// Important: Test this... wrong official typings
// tslint:disable-next-line:no-var-requires
const web3 = require('web3');

export class Ethereum {

  public engine: any;
  public web3: any;

  constructor() {

    this.engine = new ProviderEngine();
    this.web3 = new web3(this.engine);

    this.engine.addProvider(new TxAdapter());

    const port = config.blockchain.ethereum.port ? ':' + config.blockchain.ethereum.port : '';

    logger.info('port: ' + port);
    logger.info('rpcUrl: ' + `${config.blockchain.ethereum.protocol}://${config.blockchain.ethereum.host}${port}`);
    // data source
    this.engine.addProvider(new RpcSubprovider({
      rpcUrl: `${config.blockchain.ethereum.protocol}://${config.blockchain.ethereum.host}${port}`,
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
