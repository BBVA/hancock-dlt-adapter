'use strict';

const express = require('express');
const validate = require('express-jsonschema').validate;
const router = express.Router();

const ProtocolEncodeModel = require(`${CONF.raml}/schemas/requests/protocol/encode.json`);
const protocolController = require('./protocolController');

router.route('/encode').get(validate({body: ProtocolEncodeModel}), protocolController.encode);
router.route('/qrEncode').get(validate({body: ProtocolEncodeModel}), protocolController.qrEncode);
router.route('/decode/:dataEncode').get(protocolController.decode);

//router.get('/:name', contract.contractInfo(request, reply, next));

// Healthcheck
router.get('/', (req, res) => {
  res.json({
    status: 'OK',
    app: 'Protocol'
  });
});

module.exports = router;