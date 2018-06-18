'use strict';

const express = require('express');
const router = express.Router();
const ethereum = require('./ethereumController');

router.use('/smartcontracts', require('./smartcontracts'));
router.use('/transfers', require('./transfers'));
router.route('/balance/:address').get(ethereum.getBalance);

// Healthcheck
router.route('/').get((req, res) => {
  res.json({
    status: 'OK',
    app: 'Ethereum'
  });
});

module.exports = router;
