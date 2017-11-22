'use strict';

var express = require('express');
var router = express.Router();

var util = require('./utilController');

router.get('/sha3', util.sha3(request, reply, next));
router.get('/fromwei', util.fromWei(request, reply, next));
router.get('/towei', util.toWei(request, reply, next));

module.exports = router
