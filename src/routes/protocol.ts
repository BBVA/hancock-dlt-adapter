import * as express from 'express';
import { validate } from 'express-jsonschema';
import { readFileSync } from 'fs';
import * as path from 'path';
import * as protocolController from '../controllers/protocol';

export const protocolRouter = express.Router();

const schemaPath = path.normalize(__dirname + '/../../../raml/schemas');
const protocolEncodeModel = JSON.parse(readFileSync(`${schemaPath}/requests/protocol/encode.json`, 'utf-8'));
const protocolDecodeModel = JSON.parse(readFileSync(`${schemaPath}/requests/protocol/decode.json`, 'utf-8'));

protocolRouter
  .post('/encode', validate({body: protocolEncodeModel}), protocolController.encode)
  .post('/decode', validate({body: protocolDecodeModel}), protocolController.decode);
