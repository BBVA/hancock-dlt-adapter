'use strict';

var responses = require('../../../components/responses');

module.exports = {
  
   bad_request: {
    statusCode: 400,
    code: responses.ndbgeneral400.code,
    message: 'Transactions - Bad request'
  },

  internal_ddbb_error: {
    statusCode: 500,
    code: responses.ndbsmartcontract500.code,
    message: 'Transactions - Internal ddbb error'
  },

  transaction_error: {
  	statusCode: 500,
  	code: responses.ndbsmartcontract500.code,
  	message: 'Transactions - Blockchain transaction error'
  },

  transaction_ok: {
  	statusCode: 202,
  	code: responses.ndbsmartcontract202.code,
  	message: 'Transactions - Blockchain transaction successfully sent. Consensus pending.'
  },

  transaction_sync_ok: {
    statusCode: 200,
    code: responses.ndbsmartcontract202.code,
    message: 'Transaction - Blockchain transaction successful'
  }

};
