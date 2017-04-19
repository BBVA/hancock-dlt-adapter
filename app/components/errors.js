'use strict';

var GlobalModule = require('./global');
var Responses = require('./responses');

exports.createGeneralError = function(message) {
  return {
    result: {
      code: Responses.kstgeneral500.code,
      description: message
    }
  }
};
