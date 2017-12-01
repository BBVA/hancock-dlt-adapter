'use strict';

const ProviderEngine = require('web3-provider-engine');
const HookedWalletSubprovider = require('web3-provider-engine/subproviders/hooked-wallet');
const RpcSubprovider = require('web3-provider-engine/subproviders/rpc');
const Web3 = require('web3');

class Ethereum {

  constructor(){
    this.engine = new ProviderEngine();
    this.web3 = new Web3(this.engine);

    this.engine.addProvider(new HookedWalletSubprovider({
      getAccounts: function(cb){ },
      approveTransaction: function(cb){ },
      signTransaction: function(cb){ },
    }));

    // data source
    this.engine.addProvider(new RpcSubprovider({
      rpcUrl: CONF.ethereum.url,
    }));

    // network connectivity error
    this.engine.on('error', function(err){
      // report connectivity errors
      console.error(err.stack)
    });

    // start polling for blocks
    this.engine.start();
  };
}

exports.Ethereum = Ethereum;