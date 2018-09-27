import * as NodeClient from 'bitcoin-core';
import * as request from 'request-promise-native';
import { address } from '../../models/common';
import config from '../config';

// API
// https://github.com/ruimarinho/bitcoin-core/blob/HEAD/src/methods.js
// https://github.com/bitpay/insight-api

let bitcoinInstance: BitcoinClient;

class BitcoinApiClient {
  private static insightApiEndpoint: string = '/insight-api';
  private url: string;

  constructor(public conf: any) {
    this.url = `${conf.host}:${conf.port}${BitcoinApiClient.insightApiEndpoint}`;
  }

  public async getInfo(): Promise<any> {
    return request(`${this.url}/status`);
  }

  public async getBalance(addr: address): Promise<any> {
    return request(`${this.url}/addr/${addr}/balance`);
  }
}

class BitcoinClient {
  constructor(
    public node: any,
    public api: BitcoinApiClient) {
  }
}

function initBitcoinClient() {

  const cfg: any = config.blockchain.bitcoin;

  const node = new NodeClient({
    host: `${cfg.nodeProtocol}://${cfg.nodeHost}`,
    port: `${cfg.nodePort}`,
  });

  const api = new BitcoinApiClient({
    host: `${cfg.apiProtocol}://${cfg.apiHost}`,
    port: `${cfg.apiPort}`,
  });

  bitcoinInstance = new BitcoinClient(node, api);

}

export async function getBitcoinClient() {

  let connReady: boolean;

  try {

    connReady = !!bitcoinInstance && await bitcoinInstance.node.getBlockchainInfo() && await bitcoinInstance.api.getInfo();

  } catch (e) {

    connReady = false;

  }

  if (!connReady) {
    initBitcoinClient();
  }

  return bitcoinInstance;

}
