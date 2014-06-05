var util = require('util');
var IOBoard = require('ioboard');
var pins = require('johnny-five/test/mock-pins');

BrowseIO = function(opts, callback) {
  if (!(this instanceof BrowseIO)) {
    return new BrowseIO(opts);
  }
  console.log('BrowseIO being created');

  IOBoard.call(this);

  opts = opts || {};

  this.name = "BrowseIO";
  this._pins = this.pins = opts.pins || pins.UNO;
  this.analogPins = opts.analogPins || pins.UNOANALOG;
  this.isReady = false;

  setTimeout(function () {
    this.connect(callback);
  }.bind(this), 1000);
}
util.inherits(BrowseIO, IOBoard);

BrowseIO.prototype.connect = function (callback) {
  console.log('BrowseIO connect');
  this.emit('connect');
  this.isReady = true;
  this.emit('ready');
  callback && callback();
}

module.exports = BrowseIO;
