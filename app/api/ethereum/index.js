'use strict';

const express = require('express');
const router = express.Router();
const ethereum = require('./ethereumController');

router.use('/smartcontracts', require('./smartcontracts'));
router.route('/balances').get(ethereum.getBalance);
router.route('/incentives').get(ethereum.getIncentive);
router.route('/receipts').get(ethereum.getReceipt);

// Healthcheck
router.route('/').get((req, res) => {
  res.json({
    status: 'OK',
    app: 'Ethereum'
  });
});

module.exports = router;
