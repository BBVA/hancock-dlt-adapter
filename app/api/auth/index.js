'use strict';

var express = require('express');
var router = express.Router();

var Auth = require('./authController');

router.post('/', Auth.getToken(request, reply, next));

module.exports = router
