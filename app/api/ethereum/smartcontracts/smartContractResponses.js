'use strict';

var responses = require('../../../components/responses');

module.exports = {
  
   bad_request: {
    statusCode: 400,
    code: responses.kstaddresses400.code,
    message: 'Smart Contract - Bad request'
  },

  smartcontract_error: {
    statusCode: 500,
    code: responses.kstsmartcontract500.code,
    message: 'Smart Contract - Blockchain request error'
  },

  smartcontract_ok: {
    statusCode: 202,
    code: responses.kstsmartcontract202.code,
    message: 'Smart Contracts - Operation successfully requested. Consensus pending'
  },

  sourcecode_not_found_error: {
    statusCode: 500,
    code: responses.kstsmartcontract500.code,
    message: 'Smart Contracts - Source code not found'
  },

  compilation_error: {
    statusCode: 500,
    code: responses.kstsmartcontract500.code,
    message: 'Smart Contract - Compilation error'
  },

  deploy_error: {
    statusCode: 500,
    code: responses.kstsmartcontract500.code,
    message: 'Smart Contract - Deployment error'
  },

  transaction_ok: {
    statusCode: 202,
    code: responses.kstsmartcontract202.code,
    message: 'Smart Contract - Transaction OK'
  },

  transaction_error: {
    statusCode: 500,
    code: responses.kstsmartcontract500.code,
    message: 'Smart Contract - Transaction Error'
  },

  invalid_transaction_invokation: {
    statusCode: 500,
    code: responses.kstsmartcontract500.code,
    message: 'Smart Contract - Invalid transaction invokation'
  }

};
