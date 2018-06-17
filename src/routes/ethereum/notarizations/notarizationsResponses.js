'use strict';

const responses = require('../../../components/responses');

module.exports = {
  
   bad_request: {
    statusCode: 400,
    code: responses.ndbgeneral400.code,
    message: 'Util - Bad request'
  },

  internal_ddbb_error: {
    statusCode: 500,
    code: responses.ndbgeneral500.code,
    message: 'Util - Internal ddbb error'
  },

  eth_web3_error: {
  	statusCode: 500,
  	code: responses.ndbsmartcontract500.code,
  	message: 'Util - Ethereum web3 error'
  },

  eth_web3_ok: {
  	statusCode: 202,
  	code: responses.ndbsmartcontract202.code,
  	message: 'Util - Ethereum web3 operation successful'
  }
  
};
