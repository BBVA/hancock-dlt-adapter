
try {

  function initSmartContractInstancesDB() {

    hancockDb = db.getSiblingDB("hancock");
    collection = hancockDb.sc_instance;

    let res = [
      collection.drop(),
      collection.createIndex({ 'alias': 1 }, { unique: true }),
      collection.createIndex({ 'address': 1 }, { unique: true }),
      collection.createIndex({ 'abiName': 1 }),
      collection.insert({ "alias": "erc20-tkn", "address": "0x9dee2e4f57ddb4bc86d53ead86a5db718ea64c00", "abiName": "erc20" }),
    ];

    printjson(res);
  }

  function initSmartContractAbisDB() {

    const abi = JSON.parse(cat('/scripts/adapter/contracts/EIP20.abi'));

    hancockDb = db.getSiblingDB("hancock");
    collection = hancockDb.sc_abi;

    let res = [
      collection.drop(),
      collection.createIndex({ 'name': 1 }, { unique: true }),
      collection.createIndex({ 'abi': 1 }),
      collection.insert({ "name": "erc20", "abi": abi }),
    ];

    printjson(res);
  }

  function initTokenInstancesDB() {

    hancockDb = db.getSiblingDB("hancock");
    collection = hancockDb.sc_token;

    let res = [
      collection.drop(),
      collection.createIndex({ 'name': 1 }),
      collection.createIndex({ 'address': 1 }, { unique: true }),
      collection.createIndex({ 'symbol': 1 }),
      collection.createIndex({ 'decimals': 1 }),
      collection.insert({ "name": "tkn", "address": "0x9dee2e4f57ddb4bc86d53ead86a5db718ea64c00", "symbol": "TKN" , "decimals": 10}),
    ];

    printjson(res);
  }

  initSmartContractAbisDB();
  initSmartContractInstancesDB();
  initTokenInstancesDB();

} catch (error) {

  print('Error, exiting', error);
  quit(1);

}

quit(0);