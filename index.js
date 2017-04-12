/**
 * Main application file
 */

'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const Web3 = require('web3');
const app = express();


global.CONF = require('./app/config');
global.LOG  = require('genesis-lib-log').init(CONF.host, CONF.application, CONF.logger.logLevel);
global.WEB3 = new Web3(new Web3.providers.HttpProvider(CONF.ethereum.url));

require('./app/routes')(app); // config routes in external file
      
app.use((err, req, res, next) => {
  res.status(err.status || 400).json({
    error: err.message
  });
  next();
});

exports.server = app.listen(CONF.port, () => {
  LOG.info('APP.INIT: App up, listening on ' + CONF.port);
});
