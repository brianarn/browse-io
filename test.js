var five = require('johnny-five');
var BrowseIO = require('./lib/browse-io');
var board, led;

board = new five.Board({
  io: new BrowseIO()
});
console.log('Board created');

board.on('ready', function() {
  console.log('Board ready');

  // Create a standard `led` hardware instance
  led = new five.Led({
    pin: 13
  });

  this.repl.inject({
    five: five,
    led: led
  });
});
