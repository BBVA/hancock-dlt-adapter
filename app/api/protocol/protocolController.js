'use strict';

const GeneralResponses = require('../../components/responses');
const Responses = require('./protocolResponses');
const Errors = require('../../components/errors');
const Utils = require('../../components/utils');
const config = require('../../config');
const querystring = require('querystring');

exports.decode = (request, reply, next) => {
  let dataDecode = JSON.parse(decodeURIComponent(request.params.dataEncode));
  return Utils.createReply(reply, Responses.request_ok, { dataDecode: dataDecode});
};

exports.encode = (request, reply, next) => {
  const qrInfo = request.body;
  let qrEncode = config.protocol.replace("__CODE__", encodeURIComponent(JSON.stringify(qrInfo)));
  return Utils.createReply(reply, Responses.request_ok, { qrEncode: qrEncode});
};