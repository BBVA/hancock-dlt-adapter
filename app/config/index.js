'use strict';

// All configurations will extend these options
// ============================================
module.exports = {

  env: process.env.NODE_ENV || 'local',

  application: 'omni:ms-blockchain-adapter',

  host: 'localhost',
  port: 3000,

  routes: {
    prefix: process.env.OMNI_ROUTES_PREFIX || '/v1/'
  },

  logger: {
    logLevel: process.env.OMNI_LOG_LEVEL || 'debug'
  },

  ethereum: {
    url: process.env.OMNI_ETHEREUM_URL || 'http://localhost:8547'
  },

  smartcontracts: {
    url: process.env.OMNI_SMARTCONTRACTS_URL || 'http://localhost:3000'
  }

};

