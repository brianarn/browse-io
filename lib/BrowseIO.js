var util = require('util');
var BoardIO = require('board-io');
var pins = require('johnny-five/test/util/mock-pins');
var Server = require('./server');
var events = require('./events');

function BrowseIO (opts, callback) {
  if (!(this instanceof BrowseIO)) {
    return new BrowseIO(opts, callback);
  }

  BoardIO.call(this, opts);

  opts = opts || {};

  this.name = opts.name || 'BrowseIO';
  this._pins = this.pins = opts.pins || pins.UNO;
  this.analogPins = opts.analogPins || pins.UNOANALOG;
  this.quiet = opts.quiet || false;
  this.connected = false;
  this.isReady = false;

  this.server = new Server(opts.server, this);

  events.on('socket-connection', this.connect.bind(this));
  events.on('server-ready', this._ready.bind(this));

  this.debug('Server created, visit localhost:3000 to continue');

  this._done = function () {
    this.debug('_done');
    if (this.connected && this.isReady && callback) {
      this.debug('_done: invoking callback');
      callback();
    }
  };
}

util.inherits(BrowseIO, BoardIO);

BrowseIO.prototype.debug = function() {
  if (this.quiet) { return; }
  var args = ['BrowseIO:'].concat(Array.from(arguments));
  console.info.apply(console, args);
};

BrowseIO.prototype.connect = function () {
  if (this.connected) { return; }
  this.debug('connect');
  this.connected = true;
  this.emit('connect');
  this._done();
};

BrowseIO.prototype._ready = function () {
  if (this.isReady) { return; }
  this.debug('ready');
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
    BoardIO.prototype[value].apply(this, arguments);
    var args = [].slice.call(arguments);
    events.emit('board-event', {
      type: value,
      args: args
    });
  };
});

module.exports = BrowseIO;
