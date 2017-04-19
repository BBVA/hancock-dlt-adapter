'use strict';

// All configurations will extend these options
// ============================================
module.exports = {

  env: process.env.NODE_ENV || 'local',

  application: 'omni:ms-blockchain-adapter',

  host: 'localhost',
  port: 9000,

  routes: {
    prefix: process.env.ROUTES_PREFIX || '/v1/'
  },

  logger: {
    logLevel: process.env.OMNI_LOG_LEVEL || 'debug'
  },

  ethereum: {
    url: process.env.ETHEREUM_URL || 'http://localhost:8545'
  },

  smartcontracts: {
    url: process.env.SMARTCONTRACTS_URL || 'http://localhost:3000'
  }

};

