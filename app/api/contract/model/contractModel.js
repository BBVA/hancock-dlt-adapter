'use strict';


/*function Contract(contractData) {
  var contract = {
    name: contractData.name,
    description: contractData.description,
    address: contractData.address,
    abi: contractData.abi,
  };

  return contract;
}*/

exports.ContractSchema = {
  "$schema": "http://json-schema.org/schema",
  "description": "Smart Contract creation schema",
  "type": "object",
  "properties": {
    "smartContractURL": {
      "type": "string"
    },
    "method": {
      "type": "string"
    },
    "params": {
      "type": "string"
    },
    "from": {
      "type": "string"
    }
  },
  "required": [ "smartContractURL", "method" ]
};
