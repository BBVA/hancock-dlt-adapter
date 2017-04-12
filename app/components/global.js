var config = {};

exports.getConfigValue = function(param) {
  return config[param];
};

exports.setConfigValue = function(param, value) {
  return config[param] = value;
};

exports.getConfigList = function() {
  return config;
};
