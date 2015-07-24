/*
 * This module is effectively a direct pull of portions of johnny-five/lib/board,
 * specifically with regards to scanning for an Arduino and creating a low level
 * firmata board.
 */

var serialport = require('serialport');

var rport = /usb|acm|^com/i;

var Serial = {
  used: [],
  attempts: [],

  detect: function(callback) {
    // Request a list of available ports, from
    // the result set, filter for valid paths
    // via known path pattern match.
    serialport.list(function(err, result) {
      // serialport.list() will never result in an error.
      // On failure, an empty array is returned. (#768)

      var ports;
      var length;

      ports = result.filter(function(val) {
        var available = true;

        // Match only ports that Arduino cares about
        // ttyUSB#, cu.usbmodem#, COM#
        if (!rport.test(val.comName)) {
          available = false;
        }

        // Don't allow already used/encountered usb device paths
        if (Serial.used.includes(val.comName)) {
          available = false;
        }

        return available;
      }).map(function(val) {
        return val.comName;
      });

      length = ports.length;

      // If no ports are detected...
      if (!length) {

        // Create an attempt counter
        if (!Serial.attempts[Serial.used.length]) {
          Serial.attempts[Serial.used.length] = 0;

          // Log notification...
          console.info('Board', 'Looking for connected device');
        }

        // Set the attempt number
        Serial.attempts[Serial.used.length]++;

        // Retry Serial connection
        Serial.detect.call(this, callback);

        return;
      }

      console.info(
        'Device(s)',
        ports
      );

      callback.call(this, ports[0]);
    }.bind(this));
  },

  connect: function(portOrPath, callback) {
    var IO = require('firmata').Board;
    var err;
    var io;
    var isConnected;
    var path;
    var type;

    if (typeof portOrPath === 'object' && portOrPath.path) {
      //
      // Board({ port: SerialPort Object })
      //
      path = portOrPath.path;

      console.info(
        (portOrPath.transport || 'SerialPort'),
        path
      );
    } else {
      //
      // Board({ port: path String })
      //
      // Board()
      //    ie. auto-detected
      //
      path = portOrPath;
    }

    // Add the usb device path to the list of device paths that
    // are currently in use - this is used by the filter function
    // above to remove any device paths that we've already encountered
    // or used to avoid blindly attempting to reconnect on them.
    Serial.used.push(path);

    try {
      io = new IO(portOrPath, function(error) {
        if (error !== undefined) {
          err = error;
        }

        callback.call(this, err, err ? 'error' : 'ready', io);
      }.bind(this));

      // Extend io instance with special expandos used
      // by Johny-Five for the IO Plugin system.
      io.name = 'Firmata Passthrough';
      io.defaultLed = 13;
      io.port = path;

      // Made this far, safely connected
      isConnected = true;
    } catch (error) {
      err = error;
    }

    if (err) {
      err = err.message || err;
    }

    // Determine the type of event that will be passed on to
    // the board emitter in the callback passed to Serial.detect(...)
    type = isConnected ? 'connect' : 'error';

    // Execute 'connect' callback
    callback.call(this, err, type, io);
  }
};

module.exports = Serial;
