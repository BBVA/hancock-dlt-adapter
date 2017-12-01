'use strict';

const uuid          = require('uuid');
const req           = require('request');
const crypto        = require('crypto');

exports.generateToken = function(bytes, format){
  return crypto.randomBytes(bytes).toString(format);
};


exports.generateUuid = function() {
  return uuid.v4();
};

exports.createResponseData = function(result, data) {
  let response = {
    result: result
  };

  if (data) response.data = data;

  return response;
};

exports.createReply = function(reply, result, data) {
  let response = {
    result: {
      code: result.statusCode,
      description: result.message
    }
  };

  if (data) response.data = data;

  return reply.status(result.statusCode).json(response);
};

exports.sendRequest = function (data){
  return new Promise((resolve, reject) => {
    req(data.reqData, function (error, response, body) {
      if (error) {
        reject(error)
      } else {
        data.response = response;
        resolve(data);
      }
    });
  });
};

exports.randomAccountNum = function (length){
    let text = "";
    let possible = "0123456789";

    for( var i=0; i < length; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
};
