/**
 * Main application routes
 */

'use strict';

const router = require('express').Router();

module.exports = (app) => {

  // Add prefix to all routes path	
  app.use(CONF.routes.prefix, router);
  
  // Define routes 
//  router.use('/auth', require('./api/auth'));
  router.use('/smartcontract', require('./api/contract'));
//  router.use('/admin', require('./api/admin'));
//  router.use('/util', require('./api/util'));
//  router.use('/transaction', require('./api/transactions'));
//  router.use('/address', require('./api/addresses'));
//  router.use('/block', require('./api/blocks'));

  // Healthcheck
  router.get('/', (req, res) => {
    res.json({
      status: 'OK',
      app: CONF.application
    });
  });

};
