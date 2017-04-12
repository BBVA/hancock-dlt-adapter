'use strict';

var ResponsesContracts  = require('./contractResponses');
var Errors          = require('../../components/errors');
var Utils           = require('../../components/utils');
var ContractModel   = require('./model/contractModel');
var Validator       = require('jsonschema').Validator;
var Q               = require('q');
var crypto          = require('crypto');
var fs              = require('fs');
var _               = require('lodash');

var CONTRACTS_NAME_COLLECTION = 'contracts';
var DEFAULT_GAS = 0x50000;

exports.create = function(request, reply, next) {

  var schema = new ContractSchema();
  contractCompile(request.payload)    // Compiles the source code
    .then(contractSubmit)     // Actually creates the contract in the Ethereum blockchain
    .then(contractInsert)     // Inserts the contract metadata in the database
    .then(function() {
      return Utils.createReply(reply, ResponsesContracts.eth_web3_ok);
    })
    .fail(function (err) {
      return Utils.createReply(reply, ResponsesContracts.eth_web3_error);      
    });

};

function contractNameExists(data) {
  var deferred = Q.defer();
  var colContract = Utils.getCollection(CONTRACTS_NAME_COLLECTION);
  colContract.findOne({name: data.name}, function(err, result) {
      if (err) { 
        deferred.reject(ResponsesContracts.internal_ddbb_error);
      } else {
        if (result) {
          console.log("Contract name exists.")
          deferred.reject(ResponsesContracts.create_already_exists);
        } else {
          deferred.resolve(data);
        }
      }
    });
  return deferred.promise;
}

function contractCompile(data) {

  var deferred = Q.defer();
  var web3 = Utils.getWeb3();

  /* Compiles the source code with Solidity */
  var compiled = web3.eth.compile.solidity(data.source, function(err, result) {
    if (err) {
      deferred.reject(ResponsesContracts.compilation_error);
    } else {      
      if (result) {      

        data.compiled = result; // Add the "compiled" object to data

        /* Create the contract object */
        data.contract = web3.eth.contract(result[data.className].info.abiDefinition);
        deferred.resolve(data);

      } else {
        deferred.reject(ResponsesContracts.compilation_error);
      }
    }
  });
  return deferred.promise;
}

function contractSubmit(data) {

  /* NOTE: As is, the account given by "data.address" must be unlocked in the
     node receiving the transaction. We should allow for already signed transactions
     to come in. Meanwhile, we can require all contracts to have an "owner" attribute
     that is set to the de iure owner of the contract. Modify this when the transaction
     signing service is available. */

  var deferred = Q.defer();
  var contract = data.contract;
  var compiled = data.compiled;
  
  /* Since the number of parameters passed to the constructor is variable, we 
     receive them in an array, and have to pass it using Javascript's native 
     apply method. Consequently, the callback has to be included in the array.
     NOTE: Probably, there is a more elegant way to do this... */
  var params = data.params;
  params.push({ "from": data.address, 
                "data": compiled[data.className].code, 
                "gas": data.gas || DEFAULT_GAS 
              });
  params.push(function(err, result) {
    if (err) {
      console.log(err);
      deferred.reject(ResponsesContracts.transaction_error);
    } else {
      if(!result.address) {
          console.log("Contract transaction sent. TransactionHash: " + result.transactionHash + " waiting to be mined...");
      } else {
        console.log("Contract mined! Address: " + result.address);
        data.contractAddress = result.address;
        deferred.resolve(data);
      }
    }
  });

  /* Send the contract creation transaction. */
  contract.new.apply(contract, params);
  return deferred.promise;
}

function contractInsert(data) {

  var deferred = Q.defer();
  var colContract = Utils.getCollection(CONTRACTS_NAME_COLLECTION);
  colContract.insert({
                      name: data.name, 
                      description: data.description, 
                      className: data.className, 
                      source: data.source, 
                      address: data.contractAddress, 
                      abi: data.compiled[data.className].info.abiDefinition
                    }, function(err, result) {
      if (err) { 
        deferred.reject(ResponsesContracts.internal_ddbb_error);
      } else {
        if (result) {
          deferred.resolve(data);
        } else {
          deferred.resolve(ResponsesContracts.internal_ddbb_error);
        }
      }
    });
  return deferred.promise; 

}
