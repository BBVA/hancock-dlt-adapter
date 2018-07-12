const fs = require('fs');
const config = require('config');
const cfg = config.get('app');

const Web3 = require('web3');

console.log(`ws://${cfg.blockchain.ethereum.host}:${cfg.blockchain.ethereum.port}`);

const web3 = new Web3(new Web3.providers.WebsocketProvider(`ws://${cfg.blockchain.ethereum.host}:${cfg.blockchain.ethereum.port}`));


web3.eth
  .getAccounts()
  .then((accounts) => {

    console.log('accounts => \n', accounts);

    web3.eth.sendTransaction({
      "from": "0x6c0a14f7561898b9ddc0c57652a53b2c6665443e",
      "data": "0xa9059cbb000000000000000000000000f01b3c2131fb5bd8d1d1e5d44f8ad14a2728ec910000000000000000000000000000000000000000000000000000000000000005",
      "gasPrice": "0x4A817C800",
      "gas": "0xc7c5",
      "to": "0x6144e332f11fac05c20375e59ee696ddfe483de0",
      "nonce": "0x2"
    })
      .on('error', function (error) {

        console.error(error);

      })
      .on('transactionHash', function (transactionHash) {

        console.log('tx hash => ' + transactionHash) // tx hash  
      })
      .on('receipt', function (receipt) {

        console.log('address => ' + receipt)

      })
      .then(function (newContractInstance) {

        console.log('new instasnce => ' + newContractInstance)
        process.exit();

      });

  });

  // tx hash => 0xe6d2fc4101ce0724ac53d797cc161d4fec2768fbc941b9ea652aec26a93fcc6c
  // address => 0x8b72a93AC71f111BF00F0ba2F50A2555b03183aD
  // new instasnce => 0x8b72a93AC71f111BF00F0ba2F50A2555b03183aD