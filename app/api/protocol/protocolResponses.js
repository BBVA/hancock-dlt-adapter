'use strict';

const responses = require('../../components/responses');

module.exports = {
  
   bad_request: {
    statusCode: 400,
    code: responses.ndbgeneral400.code,
    message: 'Bad request'
  },

  request_error: {
    statusCode: 500,
    code: responses.ndbgeneral500.code,
    message: 'Request error'
  },

  request_ok: {
    statusCode: 200,
    code: responses.ndbgeneral200.code,
    message: 'Operation successfully requested'
  },


};
