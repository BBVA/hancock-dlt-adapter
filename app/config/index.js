'use strict';

// All configurations will extend these options
// ============================================
module.exports = {

  env: process.env.NODE_ENV || 'local',

  application: 'hancock:ms-dlt-adapter',

  host: 'localhost',
  port: process.env.DLT_ADAPTER_PORT || 3000,

  routes: {
    prefix: process.env.DLT_ADAPTER_ROUTES_PREFIX || '/'
  },

  mongo: {
    url: process.env.DLT_ADAPTER_MONGO_URI || 'mongodb://localhost:27018/hancock',
    collections: {
      smartContracts: process.env.DLT_ADAPTER_COLLECTION_SMARTCONTRACTS || 'smartcontracts'
    }
  },

  logger: {
    logLevel: process.env.DLT_ADAPTER_LOG_LEVEL || 'debug'
  },

  ethereum: {
    url: process.env.DLT_ADAPTER_ETHEREUM_URL || 'http://localhost:8547'
  }
};

