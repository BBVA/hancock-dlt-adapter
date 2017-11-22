'use strict';

var GeneralResponses       = require('../../../components/responses')
var ResponsesUtil  = require('./utilResponses');
var Errors          = require('../../../components/errors');
var config          = require('../../config/environment');
var mongo           = require('mongodb');
var Utils           = require('../../../components/utils');
//var AdminModel   = require('./model/adminModel')
//var AdminSchema  = require('./model/adminModelJoi')
var Joi             = require('joi');
var Q               = require('q');
var crypto          = require('crypto');
var w               = require('winston');
var fs              = require('fs');
var _               = require('lodash');

//var DEFAULT_GAS = 0x50000;

exports.sha3 = function(request, reply, next) {
  var web3 = Utils.getWeb3();
  // XXX @todo parse querystring data!!
  if (request.query.encoding === "hex") {
    return Utils.createReply(reply, ResponsesUtil.eth_web3_ok, 
      web3.sha3(request.query.string, {encoding: 'hex'}));
  }

  return Utils.createReply(reply, ResponsesUtil.eth_web3_ok, 
    web3.sha3(request.query.string));  
};

exports.fromWei = function(request, reply, next) {
  var web3 = Utils.getWeb3();
  // XXX @todo parse querystring data!!
  return Utils.createReply(reply, ResponsesUtil.eth_web3_ok, 
    web3.fromWei(request.query.amount, request.query.unit));
};

exports.toWei = function(request, reply, next) {
  var web3 = Utils.getWeb3();
  // XXX @todo parse querystring data!!
  return Utils.createReply(reply, ResponsesUtil.eth_web3_ok, 
    web3.toWei(request.query.amount, request.query.unit));  
};