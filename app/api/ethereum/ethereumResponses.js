'use strict';

const responses = require('../../components/responses');

module.exports = {
  
   bad_request: {
    statusCode: 400,
    code: responses.ndbgeneral400.code,
    message: 'Ethereum - Bad request'
  },

  ethereum_error: {
    statusCode: 500,
    code: responses.ndbsmartcontract500.code,
    message: 'Ethereum - Blockchain request error'
  },

  ethereum_ok: {
    statusCode: 202,
    code: responses.ndbsmartcontract202.code,
    message: 'Ethereum - Operation successfully requested. Consensus pending'
  },


};
