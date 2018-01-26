'use strict';

var responses = require('../../../components/responses');

module.exports = {
  
  success: {
    statusCode: 200,
    code: responses.ndbgeneral200.code,
    message: 'Smart Contract - Success'
  },
  
  register_smartcontract_success: {
    statusCode: 200,
    code: responses.ndbsmartcontract409.code,
    message: 'Smart Contract - Alias in use'
  },
  
  created: {
    statusCode: 201,
    code: responses.ndbgeneral201.code,
    message: 'Smart Contract - Created'
  },
  
  transaction_ok: {
    statusCode: 202,
    code: responses.ndbsmartcontract202.code,
    message: 'Smart Contract - Transaction OK'
  },
  
  smartcontract_accepted: {
    statusCode: 202,
    code: responses.ndbsmartcontract202.code,
    message: 'Smart Contracts - Operation successfully requested. Consensus pending'
  },
  
  no_content: {
    statusCode: 204,
    code: responses.ndbgeneral204.code,
    message: responses.ndbgeneral204.description
  },
  
  bad_request: {
    statusCode: 400,
    code: responses.ndbgeneral400.code,
    message: 'Smart Contract - Bad request'
  },
  
  not_found: {
    statusCode: 404,
    code: responses.ndbgeneral404.code,
    message: 'Smart Contract - Not Found'
  },
  
  sourcecode_not_found_error: {
    statusCode: 404,
    code: responses.ndbgeneral404.code,
    message: 'Smart Contracts - Source code not found'
  },
  
  conflict: {
    statusCode: 409,
    code: responses.ndbsmartcontract409.code,
    message: 'Smart Contract - Alias or address in use'
  },
  
  internal_server_error: {
    statusCode: 500,
    code: responses.ndbgeneral500.code,
    message: 'Smart Contract - Internal Server Error'
  },
  
  smartcontract_error: {
    statusCode: 500,
    code: responses.ndbsmartcontract500.code,
    message: 'Smart Contract - Blockchain request error'
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
