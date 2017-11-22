/**
 * Main application routes
 */

'use strict';

const fs  = require('fs');
const changeCase = require('change-case');
const router = require('express').Router();

module.exports = (app) => {

  let dirs = fs.readdirSync('./app/api');
  // Add prefix to all routes path

  app.use('/', router);

  dirs.forEach((routeName) => {
    require('./api/' + routeName);
    // Define routes
    router.use('/smartcontracts', require('./api/'+changeCase.paramCase(routeName)+'/smartcontracts'));
    router.use('/transfers', require('./api/'+changeCase.paramCase(routeName)+'/transfers'));
    router.use('/notarizations', require('./api/'+changeCase.paramCase(routeName)+'/notarizations'));
    router.use('/balance', require('./api/'+changeCase.paramCase(routeName)+'/balance'));
    router.use('/incentive', require('./api/'+changeCase.paramCase(routeName)+'/incentive'));
    router.use('/receipt', require('./api/'+changeCase.paramCase(routeName)+'/receipt'));
  });

  // router.use('/address', require('./api/addresses'));
  // router.use('/block', require('./api/blocks'));
  // router.use('/admin', require('./api/admin'));
  // router.use('/util', require('./api/util'));
  // router.use('/auth', require('./api/auth'));

  // Healthcheck
  app.get('/', (req, res) => {
    res.json({
      status: 'OK',
      app: CONF.application
    });
  });

};
