import * as crypto from 'crypto';
import * as req from 'request';
import * as uuid from 'uuid';

function generateToken(bytes: any, format: any) {
  return crypto.randomBytes(bytes).toString(format);
}

function generateUuid() {
  return uuid.v4();
}

function createResponseData(result: any, data: any) {
  const response: any = {
    result,
  };

  if (data) { response.data = data; }

  return response;
}

function createReply(reply: any, result: any, data: any) {
  let replyStatus;
  if (result) {
    const response: any = {
      result: {
        code: result.statusCode,
        description: result.message,
      },
    };

    if (data) { response.data = data; }

    replyStatus = reply.status(result.statusCode).json(response);
  } else {
    replyStatus = reply.status(204).json();
  }

  return replyStatus;
}

function sendRequest(data: any) {
  return new Promise((resolve: any, reject) => {
    req(data.reqData, (error: any, response: any, body: any) => {
      if (error) {
        reject(error);
      } else {
        data.response = response;
        resolve(data);
      }
    });
  });
}

function randomAccountNum(length: number) {
  const possible = '0123456789';
  let text = '';

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return text;
}

function strToHex(str: string): string {
  return '0x' + Buffer.from(str, 'utf8').toString('hex');
}
