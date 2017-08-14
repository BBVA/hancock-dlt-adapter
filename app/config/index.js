'use strict';

// All configurations will extend these options
// ============================================
module.exports = {

  env: process.env.NODE_ENV || 'local',

  application: 'archer:ms-blockchain-adapter',

  host: 'localhost',
  port: process.env.ARCHER_PORT || 3000,

  routes: {
    prefix: process.env.ARCHER_ROUTES_PREFIX || '/v1/'
  },

  logger: {
    logLevel: process.env.ARCHER_LOG_LEVEL || 'debug'
  },

  ethereum: {
    url: process.env.ARCHER_ETHEREUM_URL || 'http://localhost:8547'
  },

  smartcontracts: {
    url: process.env.ARCHER_SMARTCONTRACTS_URL || 'http://localhost:3000'
  }

};

