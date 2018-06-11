'use strict';

const GeneralResponses = require('../../components/responses');
const Responses = require('./protocolResponses');
const Errors = require('../../components/errors');
const Utils = require('../../components/utils');
const config = require('../../config');
const querystring = require('querystring');

exports.decode = (request, reply, next) => {
  const removedPath = config.protocol.replace("__CODE__", "");
  const dataDecode = JSON.parse(decodeURIComponent(request.body.code.replace(removedPath, "")));
  return Utils.createReply(reply, Responses.request_ok, dataDecode);
};

exports.encode = (request, reply, next) => {
  const qrEncode = config.protocol.replace("__CODE__", encodeURIComponent(JSON.stringify(request.body)));
  return Utils.createReply(reply, Responses.request_ok, { qrEncode: qrEncode});
};