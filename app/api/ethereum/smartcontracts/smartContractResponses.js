'use strict';

var responses = require('../../../components/responses');

module.exports = {
  
   bad_request: {
    statusCode: 400,
    code: responses.ndbgeneral400.code,
    message: 'Smart Contract - Bad request'
  },

  smartcontract_error: {
    statusCode: 500,
    code: responses.ndbsmartcontract500.code,
    message: 'Smart Contract - Blockchain request error'
  },

  smartcontract_ok: {
    statusCode: 202,
    code: responses.ndbsmartcontract202.code,
    message: 'Smart Contracts - Operation successfully requested. Consensus pending'
  },

  sourcecode_not_found_error: {
    statusCode: 404,
    code: responses.ndbgeneral404.code,
    message: 'Smart Contracts - Source code not found'
  },

  compilation_error: {
    statusCode: 500,
    code: responses.ndbsmartcontract500.code,
    message: 'Smart Contract - Compilation error'
  },

  deploy_error: {
    statusCode: 500,
    code: responses.ndbsmartcontract500.code,
    message: 'Smart Contract - Deployment error'
  },

  transaction_ok: {
    statusCode: 202,
    code: responses.ndbsmartcontract202.code,
    message: 'Smart Contract - Transaction OK'
  },

  transaction_error: {
    statusCode: 500,
    code: responses.ndbsmartcontract500.code,
    message: 'Smart Contract - Transaction Error'
  },

  invalid_transaction_invokation: {
    statusCode: 500,
    code: responses.ndbsmartcontract500.code,
    message: 'Smart Contract - Invalid transaction invokation'
  }

};
