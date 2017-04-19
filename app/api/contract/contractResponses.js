'use strict';

var responses = require('../../components/responses');

module.exports = {
  
   bad_request: {
    statusCode: 400,
    code: responses.kstaddresses400.code,
    message: 'Smart Contract - Bad request'
  },

  smartcontract_error: {
    statusCode: 512,
    code: responses.kstsmartcontract512.code,
    message: 'Smart Contract - Blockchain request error'
  },

  smartcontract_ok: {
    statusCode: 202,
    code: responses.kstsmartcontract202.code,
    message: 'Smart Contracts - Operation successfully requested. Consensus pending'
  }

};
