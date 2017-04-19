'use strict';

var uuid          = require('uuid');
var Q             = require('q');
var req           = require('request');
var crypto        = require('crypto');

exports.generateToken = function(bytes, format){
  return crypto.randomBytes(bytes).toString(format);
}


exports.generateUuid = function() {
  return uuid.v4();
};

exports.createResponseData = function(result, data) {
  var response = {
    result: result
  };

  if (data) response.data = data;

  return response;
};

exports.createReply = function(reply, result, data) {
  var response = {
    result: {
      code: result.code,
      description: result.message
    }
  };

  if (data) response.data = data;

  return reply.status(result.statusCode).json(response);
}

exports.sendRequest = function (data){
  var deferred = Q.defer();
  req(data.reqData, function(error, response, body){
    if(error) {
      deferred.reject(error)
    } else {
      data.response = response;
      deferred.resolve(data);
    }
  });
  return deferred.promise;
}

exports.randomAccountNum = function (length){
    var text = "";
    var possible = "0123456789";

    for( var i=0; i < length; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}
