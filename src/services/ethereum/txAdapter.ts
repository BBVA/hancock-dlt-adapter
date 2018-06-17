/*
 * Emulate 'eth_accounts' / 'eth_sendTransaction' using 'eth_sendRawTransaction'
 *
 * The two callbacks a user needs to implement are:
 * - getAccounts() -- array of addresses supported
 * - signTransaction(tx) -- sign a raw transaction object
 */

import * as Subprovider from 'web3-provider-engine/subproviders/subprovider';
import * as estimateGas from 'web3-provider-engine/util/estimate-gas';

// intercepts the following methods:
//   eth_sendTransaction
//   eth_sign

//
// Tx Signature Flow
//
// handleRequest: eth_sendTransaction
//   validateTransaction (basic validity check)
//     validateSender (checks that sender is in accounts)
//   processTransaction (sign tx and submit to network)
//     approveTransaction (UI approval hook)
//     checkApproval
//     finalizeAndSubmitTx (tx signing)
//       nonceLock.take (bottle neck to ensure atomic nonce)
//         fillInTxExtras (set fallback gasPrice, nonce, etc)
//         signTransaction (perform the signature)
//         publishTransaction (publish signed tx to network)
//

export class TxAdapter extends Subprovider {

  constructor() {
    super();
    /*const self = this;
    // control flow
    // data lookup
    if (!opts.getSigner) throw new Error('ProviderEngine - TxAdapter - did not provide "getSigner" 
    fn in constructor options');
    self.getSigner = opts.getSigner;
    // high level override
    if (opts.processTransaction) self.processTransaction = opts.processTransaction;*/
    /* if (opts.processMessage) self.processMessage = opts.processMessage;
     if (opts.processPersonalMessage) self.processPersonalMessage = opts.processPersonalMessage;
     if (opts.processTypedMessage) self.processTypedMessage = opts.processTypedMessage;*/
    // approval hooks
    /*self.approveTransaction = opts.approveTransaction || self.autoApprove;
    self.approveMessage = opts.approveMessage || self.autoApprove;
    self.approvePersonalMessage = opts.approvePersonalMessage || self.autoApprove;
    self.approveTypedMessage = opts.approveTypedMessage || self.autoApprove;*/
    // actually perform the signature
    /*if (opts.signTransaction) self.signTransaction = opts.signTransaction;*/
    /*  if (opts.signMessage) self.signMessage = opts.signMessage;
      if (opts.signPersonalMessage) self.signPersonalMessage = opts.signPersonalMessage;
      if (opts.signTypedMessage) self.signTypedMessage = opts.signTypedMessage;
      if (opts.recoverPersonalSignature) self.recoverPersonalSignature = opts.recoverPersonalSignature;
      // publish to network
      if (opts.publishTransaction) self.publishTransaction = opts.publishTransaction*/
  }

  public handleRequest(payload: any, next: any, end: any) {
    const self = this;
    switch (payload.method) {
      case 'eth_accounts':
        LOG.debug('Intercepted Ethereum Accounts');
        self.getAccounts()
          .then(end)
          .catch((error) => {
            LOG.error('Error getting accounts');
          });
        return;
      case 'eth_call':
        LOG.debug('Intercepted Ethereum Call');
        const call = payload.params[0];
        self.fillInTxExtras(call)
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
        self.fillInTxExtras(tx)
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
    const self = this;
    LOG.debug('Adding transaction extra params');

    const address: string = txParams.from;
    const reqs: any[] = [];

    if (txParams.gasPrice === undefined) {
      // console.log("need to get gasprice")
      reqs.push(self.emitPayload.bind(self, { method: 'eth_gasPrice', params: [] }));
    }

    if (txParams.nonce === undefined) {
      // console.log("need to get nonce")
      reqs.push(self.emitPayload.bind(self, { method: 'eth_getTransactionCount', params: [address, 'pending'] }));
    }

    if (txParams.gas === undefined) {
      // console.log("need to get gas")
      reqs.push(estimateGas.bind(null, self.engine, cloneTxParams(txParams)));
    }

    return new Promise((resolve, reject) => {
      Promise
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
    });
  }
}

// we use this to clean any custom params from the txParams
function cloneTxParams(txParams: any) {
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
