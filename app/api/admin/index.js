'use strict';

var express = require('express');
var router = express.Router();
var admin = require('./adminController');

router.get('/version/api', admin.versionAPI(request, reply, next));
router.get('/version/node', admin.versionNode(request, reply, next));
router.get('/version/network', admin.versionNetwork(request, reply, next));
router.get('/version/ethereum', admin.versionEthereum(request, reply, next));
router.get('/version/whisper', admin.versionWhisper(request, reply, next));
router.get('/connection', admin.isConnected(request, reply, next));
router.post('/provider', admin.setProvider(request, reply, next));
router.get('/provider', admin.currentProvider(request, reply, next));
router.get('/listening', admin.netListening(request, reply, next));
router.get('/peers/count', admin.peerCount(request, reply, next));
router.post('/accounts/default', admin.setDefaultAccount(request, reply, next));
router.get('/accounts/default', admin.defaultAccount(request, reply, next));
router.get('/blocks/default', admin.defaultBlock(request, reply, next));
router.get('/syncing', admin.syncing(request, reply, next));
router.get('/coinbase', admin.coinbase(request, reply, next));
router.get('/mining', admin.mining(request, reply, next));
router.post('/miner/start', admin.minerStart(request, reply, next));
router.post('/miner/stop', admin.minerStop(request, reply, next));
router.get('/hashrate', admin.hashrate(request, reply, next));
router.get('/accounts', admin.accounts(request, reply, next));
router.get('/compilers', admin.getCompilers(request, reply, next));
router.get('/dbstrings', admin.getDbString(request, reply, next));
router.post('/dbstrings', admin.putDbString(request, reply, next));
router.get('/dbhex', admin.getDbHex(request, reply, next));
router.post('/dbhex', admin.putDbHex(request, reply, next));

module.exports = router
