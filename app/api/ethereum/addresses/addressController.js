'use strict';

var GeneralResponses       = require('../../../components/responses')
var ResponsesAddress  = require('./addressResponses');
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

exports.getTransactionCount = function(request, reply, next) {
  var web3 = Utils.getWeb3();
  // XXX @todo parse querystring data!!
  var block = request.query.block;
  if (block === undefined) {
    web3.eth.getTransactionCount(request.params.address, function(err, result) {
      if(err) {
        console.log("Error getting transaction count.");
        return Utils.createReply(reply, ResponsesAddress.eth_web3_error);
      } else {
        if (result === 0) result = "0";
        return Utils.createReply(reply, ResponsesAddress.eth_web3_ok, result);        
      }
    })
  } else {
    web3.eth.getTransactionCount(request.params.address, block, function(err, result) {
      if(err) {
        console.log("Error getting transaction count.");
        return Utils.createReply(reply, ResponsesAddress.eth_web3_error);
      } else {
        if (result === 0) result = "0";        
        return Utils.createReply(reply, ResponsesAddress.eth_web3_ok, result);
      }  
    })
  }

};

exports.getBalance = function(request, reply, next) {
  var web3 = Utils.getWeb3();
  // XXX @todo parse querystring data!!
  var block = request.query.block;
  if (block === undefined) {
    web3.eth.getBalance(request.params.address, function(err, result) {
      if(err) {
        console.log("Error getting address balance.");
        return Utils.createReply(reply, ResponsesAddress.eth_web3_error);
      } else {
        return Utils.createReply(reply, ResponsesAddress.eth_web3_ok, result);
      }
    })
  } else {
    web3.eth.getBalance(request.params.address, block, function(err, result) {
      if(err) {
        console.log("Error getting address balance.");
        return Utils.createReply(reply, ResponsesAddress.eth_web3_error);
      } else {
        return Utils.createReply(reply, ResponsesAddress.eth_web3_ok, result);
      }  
    })
  }

};

exports.getStorageAt = function(request, reply, next) {
  var web3 = Utils.getWeb3();
  // XXX @todo parse querystring data!!
  var block = request.query.block;
  var position = request.query.pos;
  if (position === undefined) {
    return Utils.createReply(reply, ResponsesAddress.bad_request);
  }
  if (block === undefined) {
    web3.eth.getStorageAt(request.params.address, position, function(err, result) {
      if(err) {
        console.log("Error getting address storage.");
        return Utils.createReply(reply, ResponsesAddress.eth_web3_error);
      } else {
        return Utils.createReply(reply, ResponsesAddress.eth_web3_ok, result);
      }
    })
  } else {
    web3.eth.getStorageAt(request.params.address, position, block, function(err, result) {
      if(err) {
        console.log("Error getting address storage.");
        return Utils.createReply(reply, ResponsesAddress.eth_web3_error);
      } else {
        return Utils.createReply(reply, ResponsesAddress.eth_web3_ok, result);
      }  
    })
  }

};

exports.getCode = function(request, reply, next) {
  var web3 = Utils.getWeb3();
  // XXX @todo parse querystring data!!
  var block = request.query.block;
  if (block === undefined) {
    web3.eth.getCode(request.params.address, function(err, result) {
      if(err) {
        console.log("Error getting address code.");
        return Utils.createReply(reply, ResponsesAddress.eth_web3_error);
      } else {
        return Utils.createReply(reply, ResponsesAddress.eth_web3_ok, result);
      }
    })
  } else {
    web3.eth.getCode(request.params.address, block, function(err, result) {
      if(err) {
        console.log("Error getting address code.");
        return Utils.createReply(reply, ResponsesAddress.eth_web3_error);
      } else {
        return Utils.createReply(reply, ResponsesAddress.eth_web3_ok, result);
      }  
    })
  }

};

exports.getEther = function(request, reply, next) {
  Utils.getWeb3().eth.sendTransaction({
    from: config.ethereum.etherbank,
    to: request.params.address,
    value: 100000*Utils.getWeb3().eth.gasPrice
  }, function(err, result) {
    if (err != null) {
      console.log(err);
      return Utils.createReply(reply, ResponsesAddress.eth_web3_error, err);
    } else {
      return Utils.createReply(reply, ResponsesAddress.eth_web3_ok, result);
    }
  });
};

