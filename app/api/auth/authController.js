'use strict';

var Errors        = require('../../components/errors');
var ResponsesAuth = require('./authResponses');
var Utils         = require('../../components/utils.js');
var config        = require('../../config/environment');
var jwt           = require('jsonwebtoken');
var crypto        = require('crypto');

var USERS_NAME_COLLECTION = 'users';

exports.getToken = function(request, reply, next) {
  if(!request.payload || !request.payload.email || !request.payload.password)
    return reply(Utils.createResponseData(ResponsesAuth.bad_request)).code(400);


  var colUser = Utils.getCollection(USERS_NAME_COLLECTION);
  var user = {
    email     : request.payload.email,
    password  : crypto.createHash('sha256').update(request.payload.password + config.salt, "utf8").digest('base64')
  };

  colUser.findOne({"email": user.email, "password": user.password}, function(err, userData){
    if(err){
      return reply(Errors.createGeneralError('Internal error')).code(500);
    } else {
      if(userData){
        var data = {
          token: jwt.sign(userData, config.secretKey)
        };
        return reply(Utils.createResponseData(ResponsesAuth.get_token_ok, data)).header("Authorization", data.token).code(200);
      } else {
        return reply(Utils.createResponseData(ResponsesAuth.auth_failed)).code(401);
      }
    }
  });
};

exports.isAuthenticated = function (decoded, request, callback) {
  var token = request.headers['authorization'];
  jwt.verify(token, config.secretKey, function(err, decoded) {
    if (!err) {
      request.user = decoded;
      return callback(null, true);
    } else {
      return callback(null, false);
    }
  });
};
