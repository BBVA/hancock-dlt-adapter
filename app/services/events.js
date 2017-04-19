/**
 * Event handler service 
 */

'use strict';

const BigNumber = require('bignumber');
const request = require('request');

module.exports = (data, result, error, ev) => {
  LOG.debug('Event captured');
  let req = {
    address: ev.address,
    method: ev.args.method,
    blockchainTimestamp: ev.args.timestamp.toNumber(),
    params: []
  };
  let argsArray = Object.values(ev.args);
  for (let i = 2; i < argsArray.length ; i++)
  {
    let param = { 
      offset: i-2,
      value: argsArray[i],
      type: 'string'
    };
    req.params.push(param);
  }
  
  let options = {
    method: 'POST',
    json: true,
    url: CONF.smartcontracts.url+'/events',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify(req)
  }
  LOG.debug(options);
  request(options, (err, resp, body) => {
    if(err) {
      LOG.info('Error in SmartContract events webhook request: '+err);
    } else {
      LOG.info('SmartContract events webhook request successful: '+resp);
    }
  });
};
