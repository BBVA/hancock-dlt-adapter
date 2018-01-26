/**
 * Main application routes
 */

'use strict';

const fs  = require('fs');
const changeCase = require('change-case');
//const router = require('express').Router();

module.exports = (app) => {

  let dirs = fs.readdirSync('./app/api');

  dirs.forEach((routeName) => {
    // Define routes
    app.use('/'+changeCase.paramCase(routeName), require('./api/' + routeName));
  });

  // Healthcheck
  app.route('/').get((req, res) => {
    res.json({
      status: 'OK',
      app: CONF.application
    });
  });

  // All undefined asset or api routes should return a 404
  app.route('/:url(api|auth)/*', function (req, res) {
    res.status(404).json({
      result: {
        code: 404,
        description: "Not Found"
      }
    })
  });


};
