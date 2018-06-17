import * as Web3 from 'web3';
import * as ProviderEngine from 'web3-provider-engine';
import * as RpcSubprovider from 'web3-provider-engine/subproviders/rpc';
import { TxAdapter } from '../services/ethereum/txAdapter';

export class Ethereum {

  public engine: any;
  public web3: any;

  constructor() {

    this.engine = new ProviderEngine();
    this.web3 = new Web3(this.engine);

    this.engine.addProvider(new TxAdapter());

    // data source
    this.engine.addProvider(new RpcSubprovider({
      rpcUrl: `ws://${CONF.blockchain.ethereum.host}:${CONF.blockchain.ethereum.port}`,
    }));

    // network connectivity error
    this.engine.on('error', function(err){
      // report connectivity errors
      console.error(err.stack)
    });

    // start polling for blocks
    this.engine.start();

  }
  
}
