'use strict';

var mongo         = require('mongodb');
var uuid          = require('uuid');
var GlobalModule  = require('./global');
var Q             = require('q');
var Joi           = require('joi');
var req           = require('request');
var crypto        = require('crypto');

exports.getCollection = function(colName) {
  return GlobalModule.getConfigValue('db').collection(colName);
};

exports.getWeb3 = function() {
  return GlobalModule.getConfigValue('web3');
}

exports.generateToken = function(bytes, format){
  return crypto.randomBytes(bytes).toString(format);
}

exports.generateObjectId = function(_id) {
  return new mongo.ObjectID(_id);
};

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
    result: result
  };

  if (data) response.data = data;

  return reply(response).code(result.statusCode);
}

exports.validateSchema = function(payload, valSchema){
  var deferred  = Q.defer();

  Joi.validate(payload, valSchema, function(err, value) {
    if (err) {
      var error = {
        message : err.details[0].message,
        code    : 400,
        statusCode    : 400
      }
      deferred.reject(error);
    } else {
      deferred.resolve(payload);
    }
  });

  return deferred.promise;
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
