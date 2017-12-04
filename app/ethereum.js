'use strict';

const ProviderEngine = require('web3-provider-engine');
const HookedWalletSubprovider = require('./services/signature-interceptor');
const RpcSubprovider = require('web3-provider-engine/subproviders/rpc');
const Web3 = require('web3');

class Ethereum {

  constructor(){
    this.engine = new ProviderEngine();
    this.web3 = new Web3(this.engine);

    this.engine.addProvider(new HookedWalletSubprovider({
      getAccounts: function(cb){
        LOG.debug('Getting signer account');
        let accounts = [];

        /*let options = {
          method: 'GET',
          url: this.url+'/txsigner/'+addr
        };*/

        /*request(options, function (error, response, body) {
          if (JSON.parse(body).result) {
            if(JSON.parse(body).result.code=="KSTTXSIGNER200")
            {
              hasAddr = true;
            }
          }
          callback(error, hasAddr);
        });*/

        cb(null, accounts);
      },
      signTransaction: function(cb){
        console.log("Sign Transaction function!");

      },
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