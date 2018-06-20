declare module 'web3-provider-engine';
declare module 'web3-provider-engine/subproviders/rpc';
declare module 'web3-provider-engine/util/estimate-gas';

declare module 'web3-provider-engine/subproviders/subprovider' {
  class Subprovider {
    engine: any;
    constructor();
    public emitPayload(): any;
  }
  export = Subprovider;
}

declare module 'express-jsonschema' {
  export function validate(...args: any[]): (...args: any[]) => any;
}

declare module 'uuid';
declare module 'method-override';
declare module 'errorhandler';

declare module NodeJS  {
  interface Global {
    CONF: any;
    LOG: any;
    DB: any;
    ETH: any;
  }
}

declare var CONF: any;
declare var LOG: any;
declare var DB: any;
declare var ETH: any;

// declare global extends global {
//   export const CONF: any;
//   export const LOG: any;
//   export const DB: any;
// }