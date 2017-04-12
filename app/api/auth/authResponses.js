'use strict';

var responses = require('../../components/responses');

module.exports = {
  auth_failed: {
    code: responses.kstauth401.code,
    message: 'Login failed. User and/or password incorrect'
  },

  get_token_ok: {
    code: responses.kstauth200.code,
    message: 'User authentication sucsessfully'
  },

  bad_request: {
    code: responses.kstauth400.code,
    message: 'Bad request. Incorrect params'
  }
};
