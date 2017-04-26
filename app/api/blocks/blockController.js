'use strict';

var GeneralResponses       = require('../../components/responses')
var ResponsesBlock  = require('./blockResponses');
var Errors          = require('../../components/errors');
var config          = require('../../config/environment');
var mongo           = require('mongodb');
var Utils           = require('../../components/utils');
//var AdminModel   = require('./model/adminModel')
//var AdminSchema  = require('./model/adminModelJoi')
var Joi             = require('joi');
var Q               = require('q');
var crypto          = require('crypto');
var w               = require('winston');
var fs              = require('fs');
var _               = require('lodash');

//var DEFAULT_GAS = 0x50000;

exports.getBlockNumber = function(request, reply, next) {
  var web3 = Utils.getWeb3();
  // XXX @todo parse querystring data!!
  web3.eth.getBlockNumber(function(err, result) {
    if(err) {
      console.log("Error getting current block number.");
      return Utils.createReply(reply, ResponsesBlock.eth_web3_error);
    } else {
      return Utils.createReply(reply, ResponsesBlock.eth_web3_ok, result);
    }
  })
};

exports.getBlock = function(request, reply, next) {
  var web3 = Utils.getWeb3();
  // XXX @todo parse querystring data!!
  var bTransactions = request.query.tx;
  if (bTransactions === "true") {
    web3.eth.getBlock(request.params.blockid, true, function(err, result) {
      if(err) {
        console.log("Error getting current block number.");
        return Utils.createReply(reply, ResponsesBlock.eth_web3_error); 
      } else {
        return Utils.createReply(reply, ResponsesBlock.eth_web3_ok, result);
      }
    })
  } else {
    web3.eth.getBlock(request.params.blockid, function(err, result) {
      if(err) {
        console.log("Error getting current block number.");
        return Utils.createReply(reply, ResponsesBlock.eth_web3_error);
      } else {
        return Utils.createReply(reply, ResponsesBlock.eth_web3_ok, result);        
      }
    })
  }
};

exports.getBlockTransactionCount = function(request, reply, next) {
  var web3 = Utils.getWeb3();
  // XXX @todo parse querystring data!!
  web3.eth.getBlockTransactionCount(request.params.blockid, function(err, result) {
    if(err) {
      console.log("Error getting current block number.");
      return Utils.createReply(reply, ResponsesBlock.eth_web3_error);
    } else {
      return Utils.createReply(reply, ResponsesBlock.eth_web3_ok, result);
    }
  })
};

exports.getUncle = function(request, reply, next) {
  var web3 = Utils.getWeb3();
  // XXX @todo parse querystring data!!
  var index = request.query.index;
  if (index === undefined) {
    return reply(Errors.createGeneralError(GeneralResponses.kstq404));  
  }
  var bTransactions = request.query.tx;
  if (bTransactions === "true") {
    web3.eth.getUncle(request.params.blockid, index, true, function(err, result) {
      if(err) {
        console.log("Error getting current block number.");
        return Utils.createReply(reply, ResponsesBlock.eth_web3_error);
      } else {
        if (result === null) result = {};
        return Utils.createReply(reply, ResponsesBlock.eth_web3_ok, result);
      }
    })
  } else {
    web3.eth.getUncle(request.params.blockid, index, function(err, result) {
      if(err) {
        console.log("Error getting current block number.");
        return Utils.createReply(reply, ResponsesBlock.eth_web3_error);        
      } else {
        if (result === null) result = {};        
        return Utils.createReply(reply, ResponsesBlock.eth_web3_ok, result);
      }
    })
  }
};