export const addressPattern: RegExp = new RegExp(/^0x[a-fA-F0-9]{40}$/i);

export function getScQueryByAddressOrAlias(addressOrAlias: string): {} {

  return addressPattern.test(addressOrAlias)
    ? { address: addressOrAlias }
    : { alias: addressOrAlias };

}

export function createReply(reply: any, result?: any, data?: any) {
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

export function strToHex(str: string): string {
  return '0x' + Buffer.from(str, 'utf8').toString('hex');
}
