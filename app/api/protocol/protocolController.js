'use strict';

const GeneralResponses = require('../../components/responses');
const Responses = require('./protocolResponses');
const Errors = require('../../components/errors');
const Utils = require('../../components/utils');
const config = require('../../config');
const querystring = require('querystring');

//var DEFAULT_GAS = 0x50000;

exports.encode = (request, reply, next) => {
  const dataEncode = encodeURIComponent(JSON.stringify(request.body));
  return Utils.createReply(reply, Responses.request_ok, { dataEncode: dataEncode});
};

exports.decode = (request, reply, next) => {
  let dataDecode = JSON.parse(decodeURIComponent(request.params.dataEncode));
  return Utils.createReply(reply, Responses.request_ok, { dataDecode: dataDecode});
};

exports.qrEncode = (request, reply, next) => {
  const qrInfo = request.body;
  let qrEncode = config.protocol + encodeURIComponent(JSON.stringify(qrInfo));
  return Utils.createReply(reply, Responses.request_ok, { qrEncode: qrEncode});
};