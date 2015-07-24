var util = require('util');
var BoardIO = require('board-io');
var five = require('johnny-five');
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
  this.forward = false;
  this._forwardIO = null;

  if (opts.forward) {
    this.forward = true;

    // If strictly a boolean, create a new instance using the Serial extract
    // from johnny-five
    if (opts.forward === true) {
      var _forwardBoard = this._forwardBoard = new five.Board({
        repl: false
      });
      _forwardBoard.on('ready', this._forwardReady.bind(this));
    } else {
      // Assume that it's an already-created IO object
      this._forwardIO = opts.forward;
      this.forwardReady = true;
    }
  }

  this.server = new Server(opts.server, this);

  events.on('socket-connection', this.connect.bind(this));
  events.on('server-ready', this._ready.bind(this));

  this.debug('Server created, visit localhost:3000 to continue');

  this._done = function () {
    this.debug('_done invoked');
    if (
      this.connected &&
      this.isReady &&
      ((this.forward && this.forwardReady) || true)
    ) {
      this.debug('_done: connected and ready!');
      events.emit('board-details', {
        pins: this.pins,
        analogPins: this.analogPins,
        modes: this.MODES,
        i2cModes: this.I2C_MODES,
        stepper: this.STEPPER
      });
      if (callback) { callback(); }
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
  this.debug('connect invoked');
  this.connected = true;
  this.emit('connect');
  this._done();
};

BrowseIO.prototype._ready = function () {
  if (this.isReady) { return; }
  this.debug('ready invoked');
  this.isReady = true;
  this.emit('ready');
  this._done();
};

BrowseIO.prototype._forwardReady = function () {
  if (this.forwardReady) { return; }
  this.debug('_forwardReady invoked');

  this._forwardIO = this._forwardBoard.io;
  /*
  this.pins       = forwardIO.pins;
  this.analogPins = forwardIO.pins;
  this.modes      = forwardIO.MODES;
  this.i2cModes   = forwardIO.IC2_MODES;
  this.stepper    = forwardIO.STEPPER;
  */
  this.forwardReady = true;
  this.emit('forwardReady');
  this._done();
};


[
  "analogRead",
  "analogWrite",
  "servoWrite",
  "pinMode",
  "digitalWrite",
  "digitalRead",
  "queryCapabilities",
  "queryAnalogMapping",
  "queryPinState",
  "sendI2CConfig",
  "i2cConfig",
  "sendI2CWriteRequest",
  "i2cWrite",
  "i2cWriteReg",
  "sendI2CReadRequest",
  "i2cRead",
  "i2cReadOnce",
  "setSamplingInterval",
  "reportAnalogPin",
  "reportDigitalPin",
  "pulseIn",
  "stepperConfig",
  "stepperStep",
  "reset",
  "sendOneWireConfig",
  "sendOneWireSearch",
  "sendOneWireAlarmsSearch",
  "sendOneWireRead",
  "sendOneWireReset",
  "sendOneWireWrite",
  "sendOneWireDelay",
  "sendOneWireWriteAndRead"
].forEach(function(method) {
  BrowseIO.prototype[method] = function() {
    this.debug(method, arguments);

    BoardIO.prototype[method].apply(this, arguments);

    var forwardIO = this._forwardIO;
    if (forwardIO && forwardIO[method]) {
      forwardIO[method].apply(forwardIO, arguments);
    }

    var args = [].slice.call(arguments);
    var event = {
      type: method,
      args: args
    };

    this.emit('board-event', event);
    events.emit('board-event', event);
  };
});

module.exports = BrowseIO;
