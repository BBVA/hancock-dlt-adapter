declare module 'web3-provider-engine';
declare module 'web3-provider-engine/subproviders/rpc';
declare module 'web3-provider-engine/subproviders/subprovider';
declare module 'web3-provider-engine/util/estimate-gas';

declare module 'express-jsonschema' {
  export function validate(...args: any[]): (...args: any[]) => any;
}

declare module 'uuid';

declare var CONF: any;
declare var LOG: any;
declare var DB: any;
declare var ETH: any;

// declare global extends global {
//   export const CONF: any;
//   export const LOG: any;
//   export const DB: any;
// }