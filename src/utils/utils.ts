export function createReply(reply: any, result?: any, data?: any) {
  let replyStatus;
  if (result) {
    const response: any = {
      result: {
        code: result.statusCode,
        description: result.message,
      },
    };

    if (data !== undefined) { response.data = data; }

    replyStatus = reply.status(result.statusCode).json(response);
  } else {
    replyStatus = reply.status(204).json();
  }

  return replyStatus;
}

export function strToHex(str: string): string {
  return '0x' + Buffer.from(str, 'utf8').toString('hex');
}
