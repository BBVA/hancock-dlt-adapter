'use strict';

var responses = require('../../../components/responses');

module.exports = {
  
   bad_request: {
    statusCode: 400,
    code: responses.kstaddresses400.code,
    message: 'Util - Bad request'
  },

  internal_ddbb_error: {
    statusCode: 500,
    code: responses.kstgeneral500.code,
    message: 'Util - Internal ddbb error'
  },

  eth_web3_error: {
  	statusCode: 512,
  	code: responses.ksteth512.code,
  	message: 'Util - Ethereum web3 error'
  },

  eth_web3_ok: {
  	statusCode: 200,
  	code: responses.ksteth200.code,
  	message: 'Util - Ethereum web3 operation successful'
  }
  
};
