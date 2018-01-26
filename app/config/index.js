'use strict';

var path = require('path');


// All configurations will extend these options
// ============================================
module.exports = {

  env: process.env.NODE_ENV || 'local',

  application: 'hancock:ms-dlt-adapter',

  host: 'localhost',
  port: process.env.DLT_ADAPTER_PORT || 3000,
  
  // Root path of server
  root: path.normalize(__dirname + '/../..'),
  
  // RAML path of server
  raml: path.normalize(__dirname + '/../../raml'),
  
  // Components path of server
  components: path.normalize(__dirname + '/../components'),
  
  // Services path of server
  services: path.normalize(__dirname + '/../services'),

  routes: {
    prefix: process.env.DLT_ADAPTER_ROUTES_PREFIX || '/'
  },

  mongo: {
    url: process.env.DLT_ADAPTER_MONGO_URI || 'mongodb://localhost:27017/hancock',
    collections: {
      smartContracts: process.env.DLT_ADAPTER_COLLECTION_SMARTCONTRACTS || 'smartcontracts'
    }
  },

  logger: {
    logLevel: process.env.DLT_ADAPTER_LOG_LEVEL || 'debug'
  },

  ethereum: {
    url: process.env.DLT_ADAPTER_ETHEREUM_URL || 'http://localhost:8545'
  }
};

