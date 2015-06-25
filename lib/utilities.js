'use strict';

var boardConstants = require('board-io/lib/constants');

exports.getModeNameByValue = function (value) {
  var modes = boardConstants.MODES
  for (var key in modes) {
    if (modes[key] === value) {
      return key;
    }
  }
};
