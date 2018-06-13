'use strict';

var ResponsesTransaction  = require('./transfersResponses');
var Utils           = require('../../../components/utils');

exports.sendTransaction = function(request, reply, next){
  if(request.body.data)
    request.body.data = Utils.strToHex(request.body.data);
  new ETH.web3.eth.sendTransaction(request.body, function(err, result) {
    if(err) {
      console.log("Error adapting send transaction.");
      return Utils.createReply(reply, ResponsesTransaction.ethereum_error);
    } else {
      return Utils.createReply(reply, ResponsesTransaction.transaction_sync_ok, result);
    }  
  })
}
