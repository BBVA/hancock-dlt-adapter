'use strict';

var GeneralResponses       = require('../../components/responses')
var ResponsesAdmin  = require('./adminResponses');
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

// XXXX GLOBAL @TODO: It seems that synchronous functions may fail sometimes  
// (e.g., after setting the provider via setProvider [DOUBT here: is this due 
// to a problem in the setProvider endpoint functionality, or does it only 
// happen when the provider is set to an invalid one?]). Should handle 
// these exceptions.

exports.versionAPI = function(request, reply, next) {
  var web3 = Utils.getWeb3();
  return Utils.createReply(reply, ResponsesAdmin.eth_web3_ok, web3.version.api);
};

exports.versionNode = function(request, reply, next) {
  var web3 = Utils.getWeb3();
  web3.version.getNode(function(err, result) {
    if(err) {
      console.log("Error getting node version.");
      return Utils.createReply(reply, ResponsesAdmin.eth_web3_error);
    } else {
      return Utils.createReply(reply, ResponsesAdmin.eth_web3_ok, result);
    }  
  })
}

exports.versionNetwork = function(request, reply, next) {
  var web3 = Utils.getWeb3();
  web3.version.getNetwork(function(err, result) {
    if(err) {
      console.log("Error getting network version.");
      return Utils.createReply(reply, ResponsesAdmin.eth_web3_error);
    } else {
      return Utils.createReply(reply, ResponsesAdmin.eth_web3_ok, result);
    }  
  })
}

exports.versionEthereum = function(request, reply, next) {
  var web3 = Utils.getWeb3();
  web3.version.getEthereum(function(err, result) {
    if(err) {
      console.log("Error getting Ethereum version.");
      return Utils.createReply(reply, ResponsesAdmin.eth_web3_error);
    } else {
      return Utils.createReply(reply, ResponsesAdmin.eth_web3_ok, result);
    }  
  })
}

exports.versionWhisper = function(request, reply, next) {
  var web3 = Utils.getWeb3();
  web3.version.getWhisper(function(err, result) {
    if(err) {
      console.log("Error getting whisper version.");
      return Utils.createReply(reply, ResponsesAdmin.eth_web3_error);
    } else {
      return Utils.createReply(reply, ResponsesAdmin.eth_web3_ok, result);
    }
  })
}

exports.isConnected = function(request, reply, next) {
  var web3 = Utils.getWeb3();
  return Utils.createReply(reply, ResponsesAdmin.eth_web3_ok, web3.isConnected());  
}

exports.setProvider = function(request, reply, next) {
  var web3 = Utils.getWeb3();
  // XXXX @todo: Check input URL!!!!
  web3.setProvider(request.payload.url);
  return Utils.createReply(reply, ResponsesAdmin.eth_web3_ok, web3.currentProvider);
}

exports.currentProvider = function(request, reply, next) {
  var web3 = Utils.getWeb3();
  return Utils.createReply(reply, ResponsesAdmin.eth_web3_ok, web3.currentProvider);
}

exports.netListening = function(request, reply, next) {
  var web3 = Utils.getWeb3();
  return Utils.createReply(reply, ResponsesAdmin.eth_web3_ok, web3.net.listening);
}

exports.peerCount = function(request, reply, next) {
  var web3 = Utils.getWeb3();
  web3.net.getPeerCount(function(err, result) {
    if(err) {
      console.log("Error getting peer count.");
      return Utils.createReply(reply, ResponsesAdmin.eth_web3_error);
    } else {
      return Utils.createReply(reply, ResponsesAdmin.eth_web3_ok, result);
    }
  })
}

exports.setDefaultAccount = function(request, reply, next) {
  var web3 = Utils.getWeb3();
  // XXXX @todo: Check input address!!!!
  web3.eth.defaultAccount = request.payload.address;
  return Utils.createReply(reply, ResponsesAdmin.eth_web3_ok, web3.eth.defaultAccount);
}

exports.defaultAccount = function(request, reply, next) {
  var web3 = Utils.getWeb3();
  var defaultAccount = web3.eth.defaultAccount;
  if (defaultAccount === undefined) {
    defaultAccount = "undefined";
  }
  return Utils.createReply(reply, ResponsesAdmin.eth_web3_ok, web3.eth.defaultAccount);  
}

exports.setDefaultBlock = function(request, reply, next) {
  var web3 = Utils.getWeb3();
  // XXXX @todo: Check input block!!!!
  web3.eth.defaultBlock = request.payload.block;
  return Utils.createReply(reply, ResponsesAdmin.eth_web3_ok, web3.eth.defaultBlock);  
}

exports.defaultBlock = function(request, reply, next) {
  var web3 = Utils.getWeb3();
  var defaultBlock = web3.eth.defaultBlock;
  if (defaultBlock === undefined) {
    defaultBlock = "undefined";
  }
  return Utils.createReply(reply, ResponsesAdmin.eth_web3_ok, defaultBlock);    
}

exports.syncing = function(request, reply, next) {
  var web3 = Utils.getWeb3();
  web3.eth.getSyncing(function(err, result) {
    if(err) {
      console.log("Error getting syncing.");
      return Utils.createReply(reply, ResponsesAdmin.eth_web3_error);    
    } else {
      if (result === false) {
        result = "false";
      }
      return Utils.createReply(reply, ResponsesAdmin.eth_web3_ok, result);
    }
  })
}

exports.coinbase = function(request, reply, next) {
  var web3 = Utils.getWeb3();
  web3.eth.getCoinbase(function(err, result) {
    if(err) {
      console.log("Error getting coinbase.");
      return Utils.createReply(reply, ResponsesAdmin.eth_web3_error);    
    } else {
      return Utils.createReply(reply, ResponsesAdmin.eth_web3_ok, result);
    }
  })
}

exports.mining = function(request, reply, next) {
  var web3 = Utils.getWeb3();
  web3.eth.getMining(function(err, result) {
    if(err) {
      console.log("Error getting mining.");
      return Utils.createReply(reply, ResponsesAdmin.eth_web3_error);    
    } else {
      return Utils.createReply(reply, ResponsesAdmin.eth_web3_ok, result);
    }
  })
}

exports.minerStart = function(request, reply, next) {
  var data = {
    reqData : {
      method: "POST",
      url: config.ethereum.url+"",
      json: {
        "jsonrpc": "2.0",
        "method": "miner_start",
        "params": []
      }
    }
  }

  Utils.sendRequest(data) 
  .then(function() {
      return Utils.createReply(reply, ResponsesAdmin.eth_web3_ok);
  })
  .fail(function(err) {
      return Utils.createReply(reply, ResponsesAdmin.eth_web3_error);    
  })
}

exports.minerStop = function(request, reply, next) {
  var data = {
    reqData : {
      method: "POST",
      url: config.ethereum.url+"",
      json: {
        "jsonrpc": "2.0",
        "method": "miner_stop",
        "params": []
      }
    }
  }

  Utils.sendRequest(data) 
  .then(function() {
      return Utils.createReply(reply, ResponsesAdmin.eth_web3_ok);
  })
  .fail(function(err) {
      return Utils.createReply(reply, ResponsesAdmin.eth_web3_error);    
  })
}

exports.hashrate = function(request, reply, next) {
  var web3 = Utils.getWeb3();
  web3.eth.getHashrate(function(err, result) {
    if(err) {
      console.log("Error getting hashrate.");
      return Utils.createReply(reply, ResponsesAdmin.eth_web3_error);    
    } else {
      return Utils.createReply(reply, ResponsesAdmin.eth_web3_ok);
    }
  })

}

exports.accounts = function(request, reply, next) {
  var web3 = Utils.getWeb3();
  web3.eth.getAccounts(function(err, result) {
    if(err) {
      console.log("Error getting accounts.");
      return Utils.createReply(reply, ResponsesAdmin.eth_web3_error);    
    } else {
      return Utils.createReply(reply, ResponsesAdmin.eth_web3_ok, result);
    }
  })

}

exports.getCompilers = function(request, reply, next) {
  var web3 = Utils.getWeb3();
  web3.eth.getCompilers(function(err, result) {
    if(err) {
      console.log("Error getting compilers.");
      return Utils.createReply(reply, ResponsesAdmin.eth_web3_error);    
    } else {
      return Utils.createReply(reply, ResponsesAdmin.eth_web3_ok, result);
    }
  })

}

exports.putDbString = function(request, reply, next) {
  var web3 = Utils.getWeb3();
  // XXX @todo check input!
  return Utils.createReply(reply, ResponsesAdmin.eth_web3_ok, 
    web3.db.putString(request.payload.db, request.payload.name, request.payload.value));
}

exports.getDbString = function(request, reply, next) {
  var web3 = Utils.getWeb3();
  // XXX @todo check input!
  web3.db.getString(request.query.db, request.query.name, function(err, result) {
    if(err) {
      console.log("Error getting string "+request.query.name+" from DB "+request.query.db);
      return Utils.createReply(reply, ResponsesAdmin.eth_web3_error);    
    } else { 
      return Utils.createReply(reply, ResponsesAdmin.eth_web3_ok, result);
    }
  })

}

exports.putDbHex = function(request, reply, next) {
  var web3 = Utils.getWeb3();
  // XXX @todo check input! 
  return Utils.createReply(reply, ResponsesAdmin.eth_web3_ok, 
    web3.db.putHex(request.payload.db, request.payload.name, request.payload.value));
}

exports.getDbHex = function(request, reply, next) {
  var web3 = Utils.getWeb3();
  // XXX @todo check input!
  web3.db.getHex(request.query.db, request.query.name, function(err, result) {
    if(err) {
      console.log("Error getting string "+request.query.name+" from DB "+request.query.db);
      return Utils.createReply(reply, ResponsesAdmin.eth_web3_error);    
    } else { 
      return Utils.createReply(reply, ResponsesAdmin.eth_web3_ok, result);
    }
  })
  
}