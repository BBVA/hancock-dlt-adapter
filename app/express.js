/**
 *  Express configuration
 */

'use strict';

const express = require('express');
const cors = require('cors');
const compression = require('compression');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const errorHandler = require('errorhandler');
const middlewares = require('./middlewares');

module.exports = function(app) {
  var env = app.get('env');

  app.use(cors());
  app.use(compression());
  app.use(middlewares.jsonSchemaValidation('JsonSchemaValidation'));
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(methodOverride());

  if ('development' === env || 'test' === env) {
    app.use(errorHandler()); // Error handler - has to be last
  }
};

