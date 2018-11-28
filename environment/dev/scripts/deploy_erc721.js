const fs = require('fs');
const config = require('config');
const cfg = config.get('app');
const Web3 = require('web3');

// console.log(`ws://${cfg.blockchain.ethereum.host}:${cfg.blockchain.ethereum.port}`);


deploy();

async function deploy() {

  const web3 = new Web3(new Web3.providers.HttpProvider(`https://rinkeby.infura.io/v3/c883b8f02a6841f4a5cb5b53365ec81b`));

  const accounts = await web3.eth.getAccounts()

  const abi = JSON.parse(fs.readFileSync(__dirname + '/contracts/ERC721.abi', 'utf8'));
  const bytecode = fs.readFileSync(__dirname + '/contracts/ERC721.bin', 'utf8');

  var contract = new web3.eth.Contract(abi);
  // const coinbase = accounts[0];
  // const coinbase = "0xwhatever";
  // const privateKey = '0xwhatever';
  // web3.eth.accounts.wallet.add(privateKey);

  // console.log('accounts => \n', web3.eth.accounts);

  const tokenName = 'Kitties';
  const tokenSymbol = 'CK_DEV';

  const gasPrice = await web3.eth.getGasPrice() * 1000;
  const nonce = await web3.eth.getTransactionCount(coinbase);
  console.log('nonce => ', nonce);
  console.log('gas price => ', gasPrice);

  await contract.deploy({
    data: bytecode,
    arguments: [tokenName, tokenSymbol]
  })
    .send({
      from: coinbase,
      gas: '7000000',
      nonce: nonce,
      gasPrice: gasPrice
    })
    .on('error', function (error) {

      console.error(error);

    })
    .on('transactionHash', function (transactionHash) {

      console.log('tx hash => ' + transactionHash) // tx hash  
    })
    .on('receipt', function (receipt) {

      console.log('address => ' + receipt.contractAddress) // contains the new contract address

    })
    // .on('confirmation', function(confirmationNumber, receipt){ ... })
    .then(function (newContractInstance) {

      console.log('new instasnce => ' + newContractInstance.options.address) // instance with the new contract address
      process.exit();

    });
}
  // tx hash => 0xe6d2fc4101ce0724ac53d797cc161d4fec2768fbc941b9ea652aec26a93fcc6c
  // address => 0x8b72a93AC71f111BF00F0ba2F50A2555b03183aD
  // new instasnce => 0x8b72a93AC71f111BF00F0ba2F50A2555b03183aD