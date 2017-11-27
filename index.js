/**
 * Main application file
 */

'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const Web3 = require('web3');
const app = express();
const Database = require('./app/database');


global.CONF = require('./app/config');
global.LOG  = require('genesis-lib-log').init(CONF.host, CONF.application, CONF.logger.logLevel);
global.DB = new Database(CONF.mongo.url);
global.WEB3 = new Web3(new Web3.providers.HttpProvider(CONF.ethereum.url));

require('./app/express')(app); 
require('./app/routes')(app); // config routes in external file

app.use((err, req, res, next) => {
  res.status(err.status || 400).json({
    error: err.message
  });
  console.log(err);
  next();
});

DB.connect()
  .then(() => {
    LOG.info('MongoDB connection open');
  })
  .catch((err) => {
    LOG.error(`MongoDB connection error: ${err}`);
    process.exit(1);
  });

// If the Node process ends, close the MongoDB connection
process.on('SIGINT', () => {
  const db = DB.get();
  if (db) {
    db.close()
      .then(() => {
        LOG.info('MongoDB disconnected through app termination');
        process.exit(0);
      })
      .catch((err) =>{
        LOG.error(`MongoDB disconnection error: ${err}`);
      });
  }
});

exports.server = app.listen(CONF.port, () => {
  LOG.info('APP.INIT: App up, listening on ' + CONF.port);
});
