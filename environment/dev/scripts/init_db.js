
try {
  
  function initDltAdapterDB() {

    const abi = JSON.parse(cat('/scripts/adapter/contracts/Token.abi'));

    constractsDb = db.getSiblingDB("hancock");
    collection = constractsDb.smartcontracts;

    let res = [
      collection.drop(),
      collection.createIndex({ 'alias': 1 }),
      collection.createIndex({ 'address': 1 }),
      collection.createIndex({ 'abi': 1 }),
      collection.insert({ "alias": "token-contract-1", "address": "0x9DeE2e4F57ddb4bC86d53EAd86a5DB718Ea64C00", "abi": abi }),
    ];

    printjson(res);
  }

  initDltAdapterDB();

} catch(error) {

  print('Error, exiting', error);
  quit(1);

}

quit(0);