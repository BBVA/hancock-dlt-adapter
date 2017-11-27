'use strict';

const SmartContractStatus = Object.freeze({
  DEPLOYED: 0,
  DESTROYED: 1
});

export default class SmartContract {
  constructor(bin, abi, address) {
    this.bin = bin;
    this.abi = abi;
    this.address = 0;
    this.status = SmartContractStatus.DEPLOYED;
  }
}