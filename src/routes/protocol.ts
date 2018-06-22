import * as express from 'express';
import { validate } from 'express-jsonschema';
import { readFileSync } from 'fs';
import * as path from 'path';
import * as protocolController from '../controllers/protocol';

export const ProtocolRouter = express.Router();

const schemaPath = path.normalize(__dirname + '/../../../raml/schemas');
const ProtocolEncodeModel = JSON.parse(readFileSync(`${schemaPath}/requests/protocol/encode.json`, 'utf-8'));
const ProtocolDecodeModel = JSON.parse(readFileSync(`${schemaPath}/requests/protocol/decode.json`, 'utf-8'));

ProtocolRouter
  .post('/encode', validate({body: ProtocolEncodeModel}), protocolController.encode)
  .post('/decode', validate({body: ProtocolDecodeModel}), protocolController.decode);
