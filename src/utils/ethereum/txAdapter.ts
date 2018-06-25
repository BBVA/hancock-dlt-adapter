/*
 * Emulate 'eth_accounts' / 'eth_sendTransaction' using 'eth_sendRawTransaction'
 *
 * The two callbacks a user needs to implement are:
 * - getAccounts() -- array of addresses supported
 * - signTransaction(tx) -- sign a raw transaction object
 */

import Subprovider = require('web3-provider-engine/subproviders/subprovider');
import estimateGas = require('web3-provider-engine/util/estimate-gas');

export class TxAdapter extends Subprovider {

  constructor() {
    super();
  }

  public async handleRequest(payload: any, next: any, end: any) {
    switch (payload.method) {
      case 'eth_accounts':
        LOG.debug('Intercepted Ethereum Accounts');
        this.getAccounts()
          .then(end)
          .catch((error) => {
            LOG.error('Error getting accounts');
          });
        return;
      case 'eth_call':
        LOG.debug('Intercepted Ethereum Call');
        const call = payload.params[0];
        this.fillInTxExtras(call)
          .then((rawTx) => {
            payload.params[0] = rawTx;
            next(null, payload);
          })
          .catch((error) => {
            LOG.error('Error handling call transaction');
            end(error);
          });
        // end(JSON.stringify(call));
        return;
      case 'eth_sendTransaction':
        LOG.debug('Intercepted Ethereum Send Transaction');
        const tx = payload.params[0];
        this.fillInTxExtras(tx)
          .then((rawTx) => {
            end(null, rawTx);
          })
          .catch((error) => {
            LOG.error('Error handling send transaction');
            end(error);
          });
        return;
      case 'eth_subscribe':
        LOG.debug('Intercepted Event Subscription');
        return;
      default:

        next();
        return;
    }
  }

  public async getAccounts() {
    LOG.debug('TODO: obtain accounts collection from wallet registry');
  }

  public fillInTxExtras(txParams: any) {
    LOG.debug('Adding transaction extra params');

    const address: string = txParams.from;
    const reqs: any[] = [];

    function callbackHandler(resolve: any, reject: any) {
      return (error: any, data: any) => error ? reject(error) : resolve(data);
    }

    reqs.push(
      txParams.gasPrice === undefined
        ? new Promise((resolve, reject) => this.emitPayload({ method: 'eth_gasPrice', params: [] }, callbackHandler(resolve, reject)))
        : Promise.resolve(null),
    );

    reqs.push(
      txParams.nonce === undefined
        // tslint:disable-next-line:max-line-length
        ? new Promise((resolve, reject) => this.emitPayload({ method: 'eth_getTransactionCount', params: [address, 'pending'] }, callbackHandler(resolve, reject)))
        : Promise.resolve(null),
    );

    reqs.push(
      txParams.gas === undefined
        ? new Promise((resolve, reject) => estimateGas(this.engine, this.cloneTxParams(txParams), callbackHandler(resolve, reject)))
        : Promise.resolve(null),
    );

    return Promise
      .all(reqs)
      .then((result: any[]) => {

        const res: any = {};
        if (result[0]) { res.gasPrice = result[0].result; }
        if (result[1]) { res.nonce = result[1].result; }
        if (result[2]) { res.gas = result[2]; }

        // TODO: Remove that and do a research about gas = undefined
        // if(!res.gas) res.gas = '0x5208';

        return Object.assign(txParams, res);
      });
  }

  // we use this to clean any custom params from the txParams
  private cloneTxParams(txParams: any) {
    return {
      data: txParams.data,
      from: txParams.from,
      gas: txParams.gas,
      gasPrice: txParams.gasPrice,
      nonce: txParams.nonce,
      to: txParams.to,
      value: txParams.value,
    };
  }

}
