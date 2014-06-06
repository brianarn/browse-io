var util = require('util');
var IOBoard = require('ioboard');
var pins = require('johnny-five/test/mock-pins');
var Server = require('./server');

BrowseIO = function(opts, callback) {
  if (!(this instanceof BrowseIO)) {
    return new BrowseIO(opts);
  }

  IOBoard.call(this, opts);

  opts = opts || {};

  this.name = "BrowseIO";
  this._pins = this.pins = opts.pins || pins.UNO;
  this.analogPins = opts.analogPins || pins.UNOANALOG;
  this.quiet = opts.quiet || false;
  this.connected = false;
  this.isReady = false;

  this.server = new Server(opts.server, this);
  this.server.on('connection', this.connect.bind(this));
  this.server.on('ready', this._ready.bind(this));

  console.info('Server created, visit localhost:3000 to continue');

  this._done = function () {
    if (this.connected && this.isReady) {
      callback && callback();
    }
  };
}
util.inherits(BrowseIO, IOBoard);

BrowseIO.prototype.debug = function() {
  if (this.quiet) { return; }
  console.info('BrowseIO: ', arguments);
};

BrowseIO.prototype.connect = function (callback) {
  if (this.connected) { return; }
  this.debug('BrowseIO connect');
  this.connected = true;
  this.emit('connect');
  this._done();
};

BrowseIO.prototype._ready = function () {
  if (this.isReady) { return; }
  this.debug('BrowseIO ready');
  this.isReady = true;
  this.emit('ready');
  this._done();
};

[
  "digitalWrite", "analogWrite", "servoWrite", "sendI2CWriteRequest",
  "analogRead", "digitalRead", "sendI2CReadRequest",
  "pinMode", "queryPinState", "sendI2CConfig",
  "setSamplingInterval"
].forEach(function(value) {
  BrowseIO.prototype[value] = function() {
    this.debug(value, arguments);
    IOBoard.prototype[value].apply(this, arguments);
    var args = [].slice.call(arguments);
    this.server.emit('event', {
      type: value,
      args: args
    });
  };
});

module.exports = BrowseIO;
